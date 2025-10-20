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


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Article CRUD operations:
    - list: GET /api/articles/ - Returns published articles (or all if authenticated with ?show_unpublished=true)
    - retrieve: GET /api/articles/{id}/ - Returns a single article
    - create: POST /api/articles/ - Creates a new article as draft (requires authentication)
    - update: PUT /api/articles/{id}/ - Updates an article (requires authentication)
    - partial_update: PATCH /api/articles/{id}/ - Partially updates an article (requires authentication)
    - destroy: DELETE /api/articles/{id}/ - Deletes an article (requires authentication)
    - publish: POST /api/articles/{id}/publish/ - Publishes an article (requires authentication)
    - unpublish: POST /api/articles/{id}/unpublish/ - Unpublishes an article (requires authentication)
    """
    queryset = Article.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
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
        # If user is authenticated and requests to see unpublished articles
        if self.request.user.is_authenticated:
            show_unpublished = self.request.query_params.get('show_unpublished', 'false').lower() == 'true'
            if show_unpublished:
                # Show all articles (published and unpublished)
                return queryset
            else:
                # Show only published articles
                return queryset.filter(publishing_date__isnull=False)
        else:
            # Anonymous users only see published articles
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
        """Publish an article"""
        article = self.get_object()
        
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
