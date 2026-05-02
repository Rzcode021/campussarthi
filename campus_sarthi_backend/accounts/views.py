from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer, AdminUserSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Registration submitted. Await admin approval.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            try:
                user = CustomUser.objects.get(email=request.data.get('email'))
                user_data = UserSerializer(user).data
                response.data['user'] = user_data
            except CustomUser.DoesNotExist:
                pass
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        allowed_fields = ['full_name', 'branch', 'year', 'phone', 'profile_photo']
        data = {k: v for k, v in request.data.items() if k in allowed_fields}
        serializer = UserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin views
class PendingUsersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(role='student', is_active=False).order_by('-created_at')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class ApproveUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.is_active = True
            user.save()
            return Response({'message': 'User approved', 'user': UserSerializer(user).data})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class RejectUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'User rejected and removed'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class AllUsersListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        role_filter = request.query_params.get('role')
        include_admin = request.query_params.get('include_admin', 'false').lower() == 'true'
        users = CustomUser.objects.all()
        if not include_admin:
            users = users.filter(is_staff=False)
        if role_filter:
            users = users.filter(role=role_filter)
        serializer = UserSerializer(users.order_by('-created_at'), many=True)
        return Response(serializer.data)


class UpdateUserRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            if user.is_superuser:
                return Response({'error': 'Cannot modify a superuser.'}, status=status.HTTP_403_FORBIDDEN)
            serializer = AdminUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(UserSerializer(user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ToggleUserActiveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            if user.is_superuser:
                return Response({'error': 'Cannot modify a superuser.'}, status=status.HTTP_403_FORBIDDEN)
            user.is_active = not user.is_active
            user.save()
            return Response(UserSerializer(user).data)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            if user.is_superuser:
                return Response({'error': 'Cannot delete a superuser.'}, status=status.HTTP_403_FORBIDDEN)
            user.delete()
            return Response({'message': 'User deleted successfully'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
