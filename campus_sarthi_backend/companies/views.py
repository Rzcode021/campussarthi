import os
from collections import defaultdict
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Company, CompanyDocument
from .serializers import (
    CompanyListSerializer, CompanyDetailSerializer, CompanyCreateSerializer,
    CompanyDocumentSerializer, CompanyDocumentUploadSerializer, AdminCompanyDocumentSerializer
)
from .permissions import IsCrewOrAdmin


class CompanyListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        companies = Company.objects.filter(status='approved')
        domain = request.query_params.get('domain')
        search = request.query_params.get('search')
        if domain:
            companies = companies.filter(domain=domain)
        if search:
            companies = companies.filter(name__icontains=search)
        serializer = CompanyListSerializer(companies, many=True, context={'request': request})
        return Response(serializer.data)


class CompanyDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            company = Company.objects.get(pk=pk, status='approved')
            serializer = CompanyDetailSerializer(company, context={'request': request})
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# Admin views
class AdminCompanyListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        companies = Company.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            companies = companies.filter(status=status_filter)
        else:
            # By default exclude drafts in the main list if no status filter? 
            # Actually, requirement says "Support ?status=draft filter as well", 
            # which implies the list should be able to show them.
            pass
        serializer = CompanyDetailSerializer(companies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CompanyCreateSerializer(data=request.data)
        if serializer.is_valid():
            company = serializer.save(uploaded_by=request.user, status='pending')
            return Response(CompanyDetailSerializer(company).data, status=status.HTTP_201_CREATED)
        
        # Format errors for the wizard: { step: X, errors: { ... } }
        # The serializer.errors will contain { 1: { ... }, 2: { ... } } if custom validation fails
        first_step_error = next(iter(serializer.errors.keys())) if serializer.errors else None
        if isinstance(first_step_error, int):
            return Response({
                'step': first_step_error,
                'errors': serializer.errors[first_step_error]
            }, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDraftSaveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        draft_id = request.data.get('id')
        if draft_id:
            try:
                company = Company.objects.get(pk=draft_id)
                serializer = CompanyCreateSerializer(company, data=request.data, partial=True)
            except Company.DoesNotExist:
                return Response({'error': 'Draft not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = CompanyCreateSerializer(data=request.data, partial=True)
        
        if serializer.is_valid():
            # For drafts, we don't care about the full validation in the serializer
            # but we use partial=True and don't call validate() in a way that blocks?
            # Wait, serializer.is_valid() calls validate().
            # I should probably have a DraftSerializer or handle it here.
            pass

        # Manual save for drafts to skip strict validation if needed
        data = request.data.copy()
        data.pop('id', None)
        
        if draft_id:
            Company.objects.filter(pk=draft_id).update(**data, status='draft', uploaded_by=request.user)
            company = Company.objects.get(pk=draft_id)
        else:
            company = Company.objects.create(**data, status='draft', uploaded_by=request.user)
            
        return Response(CompanyDetailSerializer(company).data, status=status.HTTP_201_CREATED)


class CompanyDraftResumeView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, pk):
        try:
            company = Company.objects.get(pk=pk, status='draft')
            serializer = CompanyDetailSerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Draft not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminCompanyDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, pk):
        try:
            company = Company.objects.get(pk=pk)
            serializer = CompanyCreateSerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminCompanyApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            company = Company.objects.get(pk=pk)
            company.status = 'approved'
            company.approved_by = request.user
            company.save()
            return Response({'message': 'Company approved', 'status': 'approved'})
        except Company.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminCompanyRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            company = Company.objects.get(pk=pk)
            company.status = 'rejected'
            company.save()
            return Response({'message': 'Company rejected', 'status': 'rejected'})
        except Company.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


# --- Company Document Views ---

class CompanyDocumentListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, company_id):
        company = get_object_or_404(Company, id=company_id, status='approved')
        documents = CompanyDocument.objects.filter(company=company, status='approved')
        
        section = request.query_params.get('section')
        if section:
            documents = documents.filter(section=section)
            
        serializer = CompanyDocumentSerializer(documents, many=True)
        
        # Group by section
        grouped = defaultdict(list)
        for doc in serializer.data:
            grouped[doc['section']].append(doc)
            
        return Response(dict(grouped))


class CompanyDocumentDownloadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, company_id, doc_id):
        from django.db.models import F
        doc = get_object_or_404(CompanyDocument, id=doc_id, company_id=company_id, status='approved')
        doc.download_count = F('download_count') + 1
        doc.save(update_fields=['download_count'])
        
        return Response({'url': doc.file.url})


class CompanyDocumentUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCrewOrAdmin]
    
    def post(self, request, company_id):
        company = get_object_or_404(Company, id=company_id, status='approved')
        serializer = CompanyDocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company, uploaded_by=request.user)
        return Response({
            "message": "Document submitted for admin review"
        }, status=status.HTTP_201_CREATED)


class MyCompanyDocumentsView(APIView):
    permission_classes = [IsAuthenticated, IsCrewOrAdmin]
    
    def get(self, request):
        docs = CompanyDocument.objects.filter(uploaded_by=request.user)
        serializer = AdminCompanyDocumentSerializer(docs, many=True)
        return Response(serializer.data)


# --- Admin Company Document Views ---

class AdminCompanyDocumentListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        docs = CompanyDocument.objects.all()
        
        status_filter = request.query_params.get('status')
        company_id = request.query_params.get('company_id')
        section = request.query_params.get('section')
        
        if status_filter:
            docs = docs.filter(status=status_filter)
        if company_id:
            docs = docs.filter(company_id=company_id)
        if section:
            docs = docs.filter(section=section)
            
        serializer = AdminCompanyDocumentSerializer(docs, many=True)
        return Response(serializer.data)


class AdminCompanyDocumentApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, pk):
        doc = get_object_or_404(CompanyDocument, pk=pk)
        doc.status = 'approved'
        doc.approved_by = request.user
        doc.save(update_fields=['status', 'approved_by'])
        return Response({"message": "Document approved"})


class AdminCompanyDocumentRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, pk):
        doc = get_object_or_404(CompanyDocument, pk=pk)
        doc.status = 'rejected'
        doc.rejection_reason = request.data.get('reason', '')
        doc.save(update_fields=['status', 'rejection_reason'])
        return Response({"message": "Document rejected"})


class AdminCompanyDocumentDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, pk):
        doc = get_object_or_404(CompanyDocument, pk=pk)
        if doc.file:
            import cloudinary.uploader
            try:
                public_id = os.path.splitext(doc.file.name)[0]
                cloudinary.uploader.destroy(public_id, resource_type='raw')
            except Exception:
                pass
        doc.delete()
        return Response({"message": "Document deleted"})
