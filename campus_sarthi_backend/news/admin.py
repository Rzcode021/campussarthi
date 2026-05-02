from django.contrib import admin
from .models import NewsArticle

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'source', 'is_published',
                    'published_by', 'published_at']
    list_filter = ['tag', 'is_published']
    search_fields = ['title', 'source']
    ordering = ['-published_at']
    list_editable = ['is_published']
