from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Resource
from .serializers import ResourceSerializer


class ResourceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resources = Resource.objects.filter(is_active=True)
        category = request.query_params.get('category')
        if category:
            resources = resources.filter(category=category)

        # Group by category
        grouped = {}
        for r in resources:
            if r.category not in grouped:
                grouped[r.category] = []
            grouped[r.category].append(ResourceSerializer(r).data)
        return Response(grouped)


class AdminResourceListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        resources = Resource.objects.all()
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ResourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user, is_active=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateResourceView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
            resource.is_active = not resource.is_active
            resource.save()
            status_text = 'active' if resource.is_active else 'inactive'
            return Response({'message': f'Resource is now {status_text}', 'is_active': resource.is_active})
        except Resource.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminResourceDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
            serializer = ResourceSerializer(resource, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Resource.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
            resource.delete()
            return Response({'message': 'Resource deleted'})
        except Resource.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
