import django_filters
from .models import Article


class ArticleFilter(django_filters.FilterSet):
    """
    Filter for Article model to enable filtering by:
    - publishing_date (exact, range, gt, lt, gte, lte)
    - tags (contains search)
    - title (contains search)
    """
    publishing_date = django_filters.DateTimeFilter(field_name='publishing_date', lookup_expr='exact')
    publishing_date_after = django_filters.DateTimeFilter(field_name='publishing_date', lookup_expr='gte')
    publishing_date_before = django_filters.DateTimeFilter(field_name='publishing_date', lookup_expr='lte')
    tags = django_filters.CharFilter(field_name='tags', lookup_expr='icontains')
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    
    class Meta:
        model = Article
        fields = ['publishing_date', 'tags', 'title', 'author']
