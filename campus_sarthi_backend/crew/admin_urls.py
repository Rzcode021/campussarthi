from django.urls import path
from .views import AdminCrewListView, AdminCrewDetailView

urlpatterns = [
    path('crew/', AdminCrewListView.as_view(), name='admin-crew-list'),
    path('crew/<int:pk>/', AdminCrewDetailView.as_view(), name='admin-crew-detail'),
]
