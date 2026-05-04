from django.urls import path
from .views import (
    AdminCrewListView, AdminCrewDetailView,
    AdminPlacementFamilyListView, AdminPlacementFamilyDetailView
)

urlpatterns = [
    path('crew/', AdminCrewListView.as_view(), name='admin-crew-list'),
    path('crew/<int:pk>/', AdminCrewDetailView.as_view(), name='admin-crew-detail'),
    path('placement-family/', AdminPlacementFamilyListView.as_view(), name='admin-placement-family-list'),
    path('placement-family/<int:pk>/', AdminPlacementFamilyDetailView.as_view(), name='admin-placement-family-detail'),
]
