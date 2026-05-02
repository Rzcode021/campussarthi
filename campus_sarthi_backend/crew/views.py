from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import CrewMember, CrewRating
from .serializers import CrewMemberSerializer, CrewRatingSerializer
from accounts.models import CustomUser


class CrewListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        crew = CrewMember.objects.filter(is_active=True).select_related('user')
        serializer = CrewMemberSerializer(crew, many=True)
        return Response(serializer.data)


class SubmitRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            crew_member = CrewMember.objects.get(pk=pk)
            stars = request.data.get('stars')
            comment = request.data.get('comment', '')

            if not stars or int(stars) < 1 or int(stars) > 5:
                return Response({'error': 'Stars must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

            CrewRating.objects.update_or_create(
                crew_member=crew_member,
                rated_by=request.user,
                defaults={'stars': int(stars), 'comment': comment}
            )
            serializer = CrewMemberSerializer(crew_member)
            return Response(serializer.data)
        except CrewMember.DoesNotExist:
            return Response({'error': 'Crew member not found'}, status=status.HTTP_404_NOT_FOUND)


class MyRatingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ratings = CrewRating.objects.filter(rated_by=request.user)
        result = {}
        for r in ratings:
            result[r.crew_member_id] = {
                'stars': r.stars,
                'comment': r.comment,
                'updated_at': r.updated_at.isoformat()
            }
        return Response(result)


# Admin views
class AdminCrewListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        crew = CrewMember.objects.all().select_related('user')
        serializer = CrewMemberSerializer(crew, many=True)
        return Response(serializer.data)

    def post(self, request):
        email = request.data.get('email')
        full_name = request.data.get('full_name', '')
        password = request.data.get('password', 'crew@123')
        title = request.data.get('title', '')
        department = request.data.get('department', '')
        bio = request.data.get('bio', '')

        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={'full_name': full_name, 'role': 'crew', 'is_active': True}
        )
        if created:
            user.set_password(password)
            user.save()

        crew, _ = CrewMember.objects.get_or_create(
            user=user,
            defaults={'title': title, 'department': department, 'bio': bio}
        )
        return Response(CrewMemberSerializer(crew).data, status=status.HTTP_201_CREATED)


class AdminCrewDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, pk):
        try:
            crew = CrewMember.objects.get(pk=pk)
            for field in ['title', 'department', 'bio', 'is_active']:
                if field in request.data:
                    setattr(crew, field, request.data[field])
            crew.save()
            return Response(CrewMemberSerializer(crew).data)
        except CrewMember.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            crew = CrewMember.objects.get(pk=pk)
            crew.is_active = False
            crew.save()
            return Response({'message': 'Crew member deactivated'})
        except CrewMember.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
