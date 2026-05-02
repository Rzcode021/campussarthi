from django.urls import path
from .views import BookmarkListView, BookmarkToggleView

urlpatterns = [
    path('', BookmarkListView.as_view(), name='bookmark-list'),
    path('toggle/', BookmarkToggleView.as_view(), name='bookmark-toggle'),
]
