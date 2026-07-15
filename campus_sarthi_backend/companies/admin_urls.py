from django.urls import path
from .views import (
    AdminCompanyListView, AdminCompanyDetailView,
    AdminCompanyApproveView, AdminCompanyRejectView,
    CompanyDraftSaveView, CompanyDraftResumeView,
    AdminCompanyDocumentListView, AdminCompanyDocumentApproveView,
    AdminCompanyDocumentRejectView, AdminCompanyDocumentDeleteView,
    AdminCompanyContributionListView, AdminCompanyContributionApproveView,
    AdminCompanyContributionRejectView
)

urlpatterns = [
    path('companies/', AdminCompanyListView.as_view(), name='admin-company-list'),
    path('companies/draft/', CompanyDraftSaveView.as_view(), name='admin-company-draft-save'),
    path('companies/draft/<int:pk>/', CompanyDraftResumeView.as_view(), name='admin-company-draft-resume'),
    path('companies/<int:pk>/', AdminCompanyDetailView.as_view(), name='admin-company-detail'),
    path('companies/<int:pk>/approve/', AdminCompanyApproveView.as_view(), name='admin-company-approve'),
    path('companies/<int:pk>/reject/', AdminCompanyRejectView.as_view(), name='admin-company-reject'),
    # Documents
    path('company-documents/', AdminCompanyDocumentListView.as_view(), name='admin-company-document-list'),
    path('company-documents/<int:pk>/approve/', AdminCompanyDocumentApproveView.as_view(), name='admin-company-document-approve'),
    path('company-documents/<int:pk>/reject/', AdminCompanyDocumentRejectView.as_view(), name='admin-company-document-reject'),
    path('company-documents/<int:pk>/', AdminCompanyDocumentDeleteView.as_view(), name='admin-company-document-delete'),
    # Contributions
    path('company-contributions/', AdminCompanyContributionListView.as_view(), name='admin-company-contribution-list'),
    path('company-contributions/<int:pk>/approve/', AdminCompanyContributionApproveView.as_view(), name='admin-company-contribution-approve'),
    path('company-contributions/<int:pk>/reject/', AdminCompanyContributionRejectView.as_view(), name='admin-company-contribution-reject'),
]
