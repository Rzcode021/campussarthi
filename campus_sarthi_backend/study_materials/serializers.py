import os
from rest_framework import serializers
from .models import StudyMaterial

ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class StudyMaterialSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'approved_by', 'file_size', 'file_type', 'download_count']

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.full_name if obj.uploaded_by else 'Admin'

    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        size = value.size
        if size > MAX_FILE_SIZE:
            raise serializers.ValidationError("File size must not exceed 10MB.")
            
        self._computed_file_type = ext.upper().lstrip('.') or 'FILE'
        if size < 1024 * 1024:
            self._computed_file_size = f"{round(size/1024, 1)} KB"
        else:
            self._computed_file_size = f"{round(size/(1024*1024), 1)} MB"
            
        return value

    def create(self, validated_data):
        instance = super().create(validated_data)
        instance.file_type = getattr(self, '_computed_file_type', 'FILE')
        instance.file_size = getattr(self, '_computed_file_size', '')
        instance.save(update_fields=['file_type', 'file_size'])
        return instance
