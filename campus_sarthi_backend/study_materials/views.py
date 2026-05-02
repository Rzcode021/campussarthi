import os
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import StudyMaterial
from .serializers import StudyMaterialSerializer


class StudyMaterialListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        materials = StudyMaterial.objects.filter(status='approved')
        category = request.query_params.get('category')
        if category:
            materials = materials.filter(category=category)
        serializer = StudyMaterialSerializer(materials, many=True, context={'request': request})
        return Response(serializer.data)


class StudyMaterialDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        from django.db.models import F
        try:
            material = StudyMaterial.objects.get(pk=pk, status='approved')
            material.download_count = F('download_count') + 1
            material.save(update_fields=['download_count'])
            return Response({'url': material.file.url})
        except StudyMaterial.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class MyStudyMaterialsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        materials = StudyMaterial.objects.filter(uploaded_by=request.user)
        serializer = StudyMaterialSerializer(materials, many=True, context={'request': request})
        return Response(serializer.data)


# Admin views
class AdminStudyMaterialListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        materials = StudyMaterial.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            materials = materials.filter(status=status_filter)
        serializer = StudyMaterialSerializer(materials, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = StudyMaterialSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user, status='pending')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminStudyMaterialApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            material = StudyMaterial.objects.get(pk=pk)
            material.status = 'approved'
            material.approved_by = request.user
            material.save(update_fields=['status', 'approved_by'])
            return Response({'message': 'Material approved', 'status': 'approved'})
        except StudyMaterial.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminStudyMaterialRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            material = StudyMaterial.objects.get(pk=pk)
            material.status = 'rejected'
            reason = request.data.get('reason', '')
            # You might want to save the reason somewhere, but the prompt says 
            # "asks for optional reason first then confirms reject" 
            # Let's assume we just log it or update a field if it existed.
            # Since the model doesn't have a rejection_reason field in the prompt, 
            # I'll just set the status and return a message.
            material.save(update_fields=['status'])
            return Response({'message': f'Material rejected. Reason: {reason}', 'status': 'rejected'})
        except StudyMaterial.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminStudyMaterialDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            material = StudyMaterial.objects.get(pk=pk)
            if material.file:
                import cloudinary.uploader
                try:
                    public_id = os.path.splitext(material.file.name)[0]
                    cloudinary.uploader.destroy(public_id, resource_type='raw')
                except Exception:
                    pass
            material.delete()
            return Response({'message': 'Material deleted'})
        except StudyMaterial.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
