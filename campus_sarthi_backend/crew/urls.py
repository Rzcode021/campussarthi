from django.urls import path
from .views import CrewListView, SubmitRatingView, MyRatingsView

urlpatterns = [
    path('', CrewListView.as_view(), name='crew-list'),
    path('my-ratings/', MyRatingsView.as_view(), name='my-ratings'),
    path('<int:pk>/rate/', SubmitRatingView.as_view(), name='submit-rating'),
]
