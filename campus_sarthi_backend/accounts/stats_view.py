from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Avg
from accounts.models import CustomUser
from companies.models import Company, CompanyDocument
from crew.models import CrewMember, CrewRating
from study_materials.models import StudyMaterial
from resources.models import Resource
from news.models import NewsArticle


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        avg = CrewRating.objects.aggregate(Avg('stars'))['stars__avg']
        return Response({
            'total_students': CustomUser.objects.filter(role='student', is_active=True).count(),
            'pending_approvals': CustomUser.objects.filter(role='student', is_active=False).count(),
            'total_companies': Company.objects.filter(status='approved').count(),
            'pending_companies': Company.objects.filter(status='pending').count(),
            'draft_companies': Company.objects.filter(status='draft').count(),
            'total_crew': CrewMember.objects.filter(is_active=True).count(),
            'avg_crew_rating': round(avg, 1) if avg else 0.0,
            'total_materials': StudyMaterial.objects.filter(status='approved').count(),
            'pending_materials': StudyMaterial.objects.filter(status='pending').count(),
            'total_documents': CompanyDocument.objects.filter(status='approved').count(),
            'pending_documents': CompanyDocument.objects.filter(status='pending').count(),
            'total_resources': Resource.objects.filter(is_active=True).count(),
            'total_news': NewsArticle.objects.filter(is_published=True).count(),
        })
