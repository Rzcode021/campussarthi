from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'full_name', 'role', 'branch',
                    'year', 'is_active', 'is_staff', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'branch', 'year']
    search_fields = ['email', 'full_name', 'phone']
    ordering = ['-created_at']
    fieldsets = UserAdmin.fieldsets + (
        ('Campus Sarthi Info', {
            'fields': ('full_name', 'role', 'branch', 'year',
                       'phone', 'profile_photo')
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'password1',
                       'password2', 'role', 'branch', 'year', 'is_active',
                       'is_staff'),
        }),
    )
