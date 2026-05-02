from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty',
                    'is_active', 'created_by', 'created_at']
    list_filter = ['category', 'difficulty', 'is_active']
    search_fields = ['title']
    ordering = ['-created_at']
    list_editable = ['is_active']
