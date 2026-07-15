from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventImageViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'event-images', EventImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
