from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)


class BookmarkToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bookmark_type = request.data.get('bookmark_type')
        object_id = request.data.get('object_id')

        if not bookmark_type or not object_id:
            return Response({'error': 'bookmark_type and object_id required'}, status=status.HTTP_400_BAD_REQUEST)

        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user,
            bookmark_type=bookmark_type,
            object_id=object_id
        )

        if not created:
            bookmark.delete()
            return Response({'bookmarked': False})

        return Response({'bookmarked': True})
