from rest_framework import serializers
from .models import Article
from django.contrib.auth.models import User


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    tags_list = serializers.ListField(read_only=True)
    is_published = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'author', 'author_name', 'tags', 'tags_list', 'publishing_date', 'updated_at', 'is_published']
        read_only_fields = ['author', 'publishing_date', 'updated_at']
    
    def get_is_published(self, obj):
        return obj.publishing_date is not None


class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer for list view with minimal fields"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    is_published = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'author_name', 'tags', 'publishing_date', 'is_published']
    
    def get_is_published(self, obj):
        return obj.publishing_date is not None
