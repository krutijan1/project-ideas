"""
WSGI application entry point for Google App Engine
"""
import os
from blog_project.wsgi import application

# Settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_project.settings')

# App Engine uses this as the WSGI application
app = application
