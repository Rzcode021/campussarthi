from django.contrib import admin
from .models import CrewMember, CrewRating

@admin.register(CrewMember)
class CrewMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'department', 'is_active']
    list_filter = ['department', 'is_active']
    search_fields = ['user__full_name', 'title']

@admin.register(CrewRating)
class CrewRatingAdmin(admin.ModelAdmin):
    list_display = ['crew_member', 'rated_by', 'stars', 'created_at']
    list_filter = ['stars']
    ordering = ['-created_at']
