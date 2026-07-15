from rest_framework import serializers
from .models import Company, CompanyDocument, CompanyContribution


class CompanyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'logo', 'domain', 'job_role',
            'salary_lpa', 'tech_requirements', 'status',
            'joining_location', 'tentative_date', 'updated_at'
        ]


class CompanyDetailSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.full_name if obj.uploaded_by else None


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        exclude = ['status', 'uploaded_by', 'approved_by', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Step 1 validation
        step1_fields = ['name', 'domain', 'about', 'job_role', 'salary_lpa', 'eligibility_criteria', 'bond_details']
        errors = {}
        
        for field in step1_fields:
            if not attrs.get(field):
                if 1 not in errors: errors[1] = {}
                errors[1][field] = ["This field is required."]

        # Step 2 validation
        step2_fields = ['gd_questions', 'interview_questions']
        for field in step2_fields:
            val = attrs.get(field, [])
            if not val or not any(str(x).strip() for x in val):
                if 2 not in errors: errors[2] = {}
                errors[2][field] = ["At least one question is required."]

        # Step 3 validation
        step3_fields = ['tech_requirements', 'selection_rounds']
        for field in step3_fields:
            val = attrs.get(field, [])
            if not val or not any(str(x).strip() for x in val):
                if 3 not in errors: errors[3] = {}
                errors[3][field] = ["At least one item is required."]
        
        if not attrs.get('package_details'):
            if 3 not in errors: errors[3] = {}
            errors[3]['package_details'] = ["This field is required."]

        if errors:
            # We raise a custom error structure that the view will catch and format
            raise serializers.ValidationError(errors)

        return attrs


class CompanyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDocument
        fields = [
            'id', 'company', 'section', 'title', 'description',
            'file_type', 'file_size', 'download_count', 'created_at', 'file'
        ]
        read_only_fields = fields


class CompanyDocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDocument
        fields = ['section', 'title', 'description', 'file']

    def validate_file(self, value):
        import os
        size = value.size
        if size > 25 * 1024 * 1024:
            raise serializers.ValidationError("File size must be under 25MB")
            
        ext = os.path.splitext(value.name)[1].upper().lstrip('.')
        allowed = {'PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX', 'PNG', 'JPG', 'JPEG', 'WEBP'}
        if ext not in allowed:
            raise serializers.ValidationError(f"File type .{ext} not supported. Allowed: PDF, DOC, DOCX, images.")
        self._computed_file_type = ext or 'FILE'
        
        if size < 1024 * 1024:
            self._computed_file_size = f"{round(size/1024, 1)} KB"
        else:
            self._computed_file_size = f"{round(size/(1024*1024), 1)} MB"
            
        return value

    def create(self, validated_data):
        validated_data['status'] = 'pending'
        instance = super().create(validated_data)
        instance.file_type = getattr(self, '_computed_file_type', 'FILE')
        instance.file_size = getattr(self, '_computed_file_size', '')
        instance.save(update_fields=['file_type', 'file_size'])
        return instance


class AdminCompanyDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = CompanyDocument
        fields = '__all__'

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.full_name if obj.uploaded_by else "Admin"


class CompanyContributionSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.ReadOnlyField(source='submitted_by.full_name')
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = CompanyContribution
        fields = [
            'id', 'company', 'company_name', 'contribution_type', 
            'content', 'file', 'status', 'submitted_by_name', 
            'created_at', 'rejection_reason'
        ]
        read_only_fields = ['status', 'submitted_by_name', 'created_at', 'rejection_reason']


class AdminCompanyContributionSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.ReadOnlyField(source='submitted_by.full_name')
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = CompanyContribution
        fields = '__all__'
