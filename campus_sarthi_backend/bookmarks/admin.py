from django.contrib import admin
from .models import Bookmark

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'bookmark_type', 'object_id', 'created_at']
    list_filter = ['bookmark_type']
    search_fields = ['user__email']
