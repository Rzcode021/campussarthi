from rest_framework import serializers
from .models import Bookmark
from companies.models import Company
from resources.models import Resource
from companies.serializers import CompanyListSerializer
from resources.serializers import ResourceSerializer

class BookmarkSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField()

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'bookmark_type', 'object_id', 'created_at', 'details']
        read_only_fields = ['user']

    def get_details(self, obj):
        if obj.bookmark_type == 'company':
            try:
                company = Company.objects.get(id=obj.object_id)
                return {
                    'name': company.name,
                    'logo': company.logo.url if company.logo else None,
                    'domain': company.domain,
                    'job_role': company.job_role
                }
            except Company.DoesNotExist:
                return None
        elif obj.bookmark_type == 'resource':
            try:
                resource = Resource.objects.get(id=obj.object_id)
                return {
                    'title': resource.title,
                    'category': resource.category,
                    'file_type': resource.file_type
                }
            except Resource.DoesNotExist:
                return None
        # Add 'question' if needed, but usually questions are within companies
        return None
