from django.contrib import admin
from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'publishing_date', 'updated_at']
    list_filter = ['publishing_date', 'author']
    search_fields = ['title', 'content', 'tags']
    date_hierarchy = 'publishing_date'
    ordering = ['-publishing_date']
