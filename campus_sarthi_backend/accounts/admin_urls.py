from django.urls import path
from .views import (
    PendingUsersListView, ApproveUserView, RejectUserView,
    AllUsersListView, UpdateUserRoleView, ToggleUserActiveView, DeleteUserView
)
from .stats_view import AdminStatsView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/pending/', PendingUsersListView.as_view(), name='admin-pending-users'),
    path('users/<int:pk>/approve/', ApproveUserView.as_view(), name='admin-approve-user'),
    path('users/<int:pk>/reject/', RejectUserView.as_view(), name='admin-reject-user'),
    path('users/<int:pk>/role/', UpdateUserRoleView.as_view(), name='admin-update-user-role'),
    path('users/<int:pk>/toggle-active/', ToggleUserActiveView.as_view(), name='admin-toggle-active'),
    path('users/<int:pk>/delete/', DeleteUserView.as_view(), name='admin-delete-user'),
    path('users/', AllUsersListView.as_view(), name='admin-all-users'),
]
