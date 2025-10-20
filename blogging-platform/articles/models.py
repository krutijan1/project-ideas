from django.db import models
from django.contrib.auth.models import User


class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
    publishing_date = models.DateTimeField(null=True, blank=True, help_text="When the article is published. Null means draft.")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-publishing_date']
    
    def __str__(self):
        return self.title
    
    @property
    def tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []
