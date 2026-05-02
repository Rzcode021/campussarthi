from django.urls import path
from .views import (
    AdminStudyMaterialListView, AdminStudyMaterialApproveView,
    AdminStudyMaterialRejectView, AdminStudyMaterialDeleteView
)

urlpatterns = [
    path('study-materials/', AdminStudyMaterialListView.as_view(), name='admin-study-material-list'),
    path('study-materials/<int:pk>/approve/', AdminStudyMaterialApproveView.as_view(), name='admin-study-material-approve'),
    path('study-materials/<int:pk>/reject/', AdminStudyMaterialRejectView.as_view(), name='admin-study-material-reject'),
    path('study-materials/<int:pk>/', AdminStudyMaterialDeleteView.as_view(), name='admin-study-material-delete'),
]
