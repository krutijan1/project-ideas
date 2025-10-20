from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, publish_article, unpublish_article

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    path('articles/<int:pk>/publish/', publish_article, name='article-publish'),
    path('articles/<int:pk>/unpublish/', unpublish_article, name='article-unpublish'),
    path('', include(router.urls)),
]
