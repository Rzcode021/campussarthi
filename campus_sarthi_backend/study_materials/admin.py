from django.contrib import admin
from .models import StudyMaterial

@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'file_type', 'file_size',
                    'status', 'uploaded_by', 'download_count', 'created_at']
    list_filter = ['category', 'status', 'file_type']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    list_editable = ['status']
    readonly_fields = ['file_size', 'file_type', 'download_count']
