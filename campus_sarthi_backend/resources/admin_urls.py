from django.urls import path
from .views import AdminResourceListView, AdminResourceDetailView, ActivateResourceView

urlpatterns = [
    path('resources/', AdminResourceListView.as_view(), name='admin-resource-list'),
    path('resources/<int:pk>/', AdminResourceDetailView.as_view(), name='admin-resource-detail'),
    path('resources/<int:pk>/activate/', ActivateResourceView.as_view(), name='admin-resource-activate'),
]
