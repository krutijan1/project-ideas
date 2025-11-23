from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer
from .filters import ArticleFilter
from .permissions import IsAuthorOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Article CRUD operations with author-based authorization:
    - list: GET /api/articles/ - Returns user's own articles when authenticated, all published articles when anonymous
      * Use ?show_unpublished=true to include unpublished articles (authenticated users only)
    - retrieve: GET /api/articles/{id}/ - Returns a single article (anyone can view published articles)
    - create: POST /api/articles/ - Creates a new article as draft (requires authentication)
    - update: PUT /api/articles/{id}/ - Updates an article (only author can update)
    - partial_update: PATCH /api/articles/{id}/ - Partially updates an article (only author can update)
    - destroy: DELETE /api/articles/{id}/ - Deletes an article (only author can delete)
    - publish: POST /api/articles/{id}/publish/ - Publishes an article (only author can publish)
    - unpublish: POST /api/articles/{id}/unpublish/ - Unpublishes an article (only author can unpublish)
    
    Authorization is enforced via IsAuthorOrReadOnly permission class.
    """
    queryset = Article.objects.all()
    permission_classes = [IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArticleFilter
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['publishing_date', 'updated_at', 'title']
    ordering = ['-publishing_date', '-updated_at']
    
    def get_queryset(self):
        """Filter articles based on authentication and publish status"""
        queryset = super().get_queryset()
        
        # For single-object operations (retrieve, update, destroy), don't filter
        # Let permission checks handle access
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy', 'publish', 'unpublish']:
            return queryset
        
        # For list view, apply filters
        if self.request.user.is_authenticated:
            # Authenticated users only see their own articles
            queryset = queryset.filter(author=self.request.user)
            
            # Check if they want to filter by publish status
            show_unpublished = self.request.query_params.get('show_unpublished', 'false').lower() == 'true'
            if not show_unpublished:
                # Show only their published articles
                queryset = queryset.filter(publishing_date__isnull=False)
            # else: Show all their articles (published and unpublished)
            
            return queryset
        else:
            # Anonymous users only see published articles from all authors
            return queryset.filter(publishing_date__isnull=False)
    
    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer
    
    def perform_create(self, serializer):
        """Set the author to the current user when creating an article as draft"""
        serializer.save(author=self.request.user, publishing_date=None)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish an article (author authorization handled by IsAuthorOrReadOnly permission)"""
        article = self.get_object()  # Permission check happens here
        
        if article.publishing_date is not None:
            return Response(
                {'error': 'Article is already published'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        article.publishing_date = timezone.now()
        article.save()
        
        serializer = self.get_serializer(article)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        """Unpublish an article (author authorization handled by IsAuthorOrReadOnly permission)"""
        article = self.get_object()  # Permission check happens here
        
        if article.publishing_date is None:
            return Response(
                {'error': 'Article is already unpublished'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        article.publishing_date = None
        article.save()
        
        serializer = self.get_serializer(article)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_article(request, pk):
    """Publish an article"""
    article = get_object_or_404(Article, pk=pk)
    
    # Check if user is the author
    if article.author != request.user:
        return Response(
            {'error': 'You can only publish your own articles'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if article.publishing_date is not None:
        return Response(
            {'error': 'Article is already published'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    article.publishing_date = timezone.now()
    article.save()
    
    serializer = ArticleSerializer(article)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unpublish_article(request, pk):
    """Unpublish an article"""
    article = get_object_or_404(Article, pk=pk)
    
    # Check if user is the author
    if article.author != request.user:
        return Response(
            {'error': 'You can only unpublish your own articles'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if article.publishing_date is None:
        return Response(
            {'error': 'Article is already unpublished'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    article.publishing_date = None
    article.save()
    
    serializer = ArticleSerializer(article)
    return Response(serializer.data)
