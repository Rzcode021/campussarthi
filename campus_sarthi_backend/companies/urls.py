from django.urls import path
from .views import (
    CompanyListView, CompanyDetailView, 
    CompanyDocumentListView, CompanyDocumentDownloadView,
    CompanyDocumentUploadView, MyCompanyDocumentsView,
    CompanyContributionCreateView
)

urlpatterns = [
    path('', CompanyListView.as_view(), name='company-list'),
    path('<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    path('<int:company_id>/contribute/', CompanyContributionCreateView.as_view(), name='company-contribution-create'),
    path('<int:company_id>/documents/', CompanyDocumentListView.as_view(), name='company-document-list'),
    path('<int:company_id>/documents/<int:doc_id>/download/', CompanyDocumentDownloadView.as_view(), name='company-document-download'),
    path('<int:company_id>/documents/upload/', CompanyDocumentUploadView.as_view(), name='company-document-upload'),
    path('my-documents/', MyCompanyDocumentsView.as_view(), name='my-company-documents'),
]
