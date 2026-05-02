from django.urls import path
from .views import AdminNewsListView, AdminNewsDetailView, PublishNewsView

urlpatterns = [
    path('news/', AdminNewsListView.as_view(), name='admin-news-list'),
    path('news/<int:pk>/', AdminNewsDetailView.as_view(), name='admin-news-detail'),
    path('news/<int:pk>/publish/', PublishNewsView.as_view(), name='admin-news-publish'),
]
