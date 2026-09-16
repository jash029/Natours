"""
Django Admin Configuration for Accounts Application.
Provides optimized administrative controls, filters, search fields, and read-only fieldsets.
"""

from accounts.models import RolePermission
from accounts.models import Permission
from django.contrib import admin
from .models import StaffProfile, StaffLoginHistory, AuditLog


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'get_full_name',
        'role',
        'department',
        'is_online',
        'is_account_locked',
        'is_deleted',
        'created_at',
    )
    list_filter = ('role', 'department', 'is_account_locked', 'is_deleted', 'is_online')
    search_fields = ('employee_id', 'user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone')
    readonly_fields = ('created_at', 'updated_at', 'deleted_at', 'last_login_at', 'last_logout_at', 'last_activity_at')
    ordering = ('-created_at',)

    fieldsets = (
        ('User Association', {
            'fields': ('user', 'employee_id')
        }),
        ('Role & Department', {
            'fields': ('role', 'department', 'phone', 'profile_image')
        }),
        ('Security & Status', {
            'fields': ('is_online', 'failed_login_attempts', 'is_account_locked', 'locked_until')
        }),
        ('Activity Timestamps', {
            'fields': ('last_login_at', 'last_logout_at', 'last_activity_at', 'password_changed_at')
        }),
        ('Audit Tracking', {
            'fields': ('is_deleted', 'created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at')
        }),
    )

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    get_full_name.short_description = 'Full Name'


@admin.register(StaffLoginHistory)
class StaffLoginHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_time', 'logout_time', 'ip_address', 'is_successful', 'logout_reason')
    list_filter = ('is_successful', 'logout_reason', 'login_time')
    search_fields = ('user__username', 'user__email', 'ip_address', 'session_key')
    readonly_fields = [f.name for f in StaffLoginHistory._meta.fields]
    ordering = ('-login_time',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'actor', 'action', 'target_model', 'target_object_id', 'ip_address')
    list_filter = ('action', 'target_model', 'timestamp')
    search_fields = ('actor__username', 'target_model', 'target_object_id', 'description', 'ip_address')
    readonly_fields = [f.name for f in AuditLog._meta.fields]
    ordering = ('-timestamp',)


admin.site.register(Permission)
admin.site.register(RolePermission)