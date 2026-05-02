from django.urls import path
from .views import StudyMaterialListView, StudyMaterialDownloadView, MyStudyMaterialsView

urlpatterns = [
    path('', StudyMaterialListView.as_view(), name='study-material-list'),
    path('my-materials/', MyStudyMaterialsView.as_view(), name='my-study-materials'),
    path('<int:pk>/download/', StudyMaterialDownloadView.as_view(), name='study-material-download'),
]
