from django.contrib import admin
from .models import Company, CompanyDocument

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'domain', 'job_role', 'salary_lpa',
                    'status', 'uploaded_by', 'created_at']
    list_filter = ['domain', 'status']
    search_fields = ['name', 'job_role']
    ordering = ['-created_at']
    list_editable = ['status']


@admin.register(CompanyDocument)
class CompanyDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'section', 'file_type',
                    'file_size', 'status', 'uploaded_by',
                    'download_count', 'created_at']
    list_filter = ['section', 'status', 'file_type']
    search_fields = ['title', 'company__name', 'uploaded_by__email']
    ordering = ['-created_at']
    list_editable = ['status']
    readonly_fields = ['file_type', 'file_size', 'download_count',
                       'created_at', 'updated_at']
