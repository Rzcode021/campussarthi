from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import NewsArticle
from .serializers import NewsArticleSerializer


class NewsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        articles = NewsArticle.objects.filter(is_published=True)
        tag = request.query_params.get('tag')
        if tag:
            articles = articles.filter(tag=tag)
        serializer = NewsArticleSerializer(articles, many=True)
        return Response(serializer.data)


class AdminNewsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        articles = NewsArticle.objects.all()
        serializer = NewsArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NewsArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(published_by=request.user, is_published=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublishNewsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            article = NewsArticle.objects.get(pk=pk)
            article.is_published = not article.is_published
            article.save()
            status_text = 'published' if article.is_published else 'draft'
            return Response({'message': f'Article moved to {status_text}', 'is_published': article.is_published})
        except NewsArticle.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminNewsDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, pk):
        try:
            article = NewsArticle.objects.get(pk=pk)
            serializer = NewsArticleSerializer(article, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NewsArticle.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            article = NewsArticle.objects.get(pk=pk)
            article.delete()
            return Response({'message': 'Article deleted'})
        except NewsArticle.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
