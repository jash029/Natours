"""
Enterprise Django Models for Accounts Application.

This module houses core administrative authentication state, staff domain profiles,
session log audit histories, and global compliance audit logs.
"""

from accounts.rbac import RBACRegistry
import uuid
from datetime import timedelta
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .constants import StaffRole, StaffDepartment, LogoutReason, AuditAction
from .managers import StaffProfileManager
from .validators import validate_phone_number, validate_employee_id


def default_employee_id():
    """Generates a default enterprise employee ID prefix (e.g. EMP-10001)."""
    return f"EMP-{uuid.uuid4().hex[:5].upper()}"



class StaffProfile(models.Model):
    """
    Enterprise Staff Domain Profile extending Django's built-in User model.
    Maintains role-based assignments, operational status, security locking state,
    and soft-delete audit tracking.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='staff_profile',
        verbose_name=_('Django User'),
    )

    employee_id = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
        default=default_employee_id,
        validators=[validate_employee_id],
        verbose_name=_('Employee ID'),
        help_text=_('Unique enterprise employee identifier (e.g., EMP-10001)'),
    )

    role = models.CharField(
        max_length=30,
        choices=StaffRole.choices,
        default=StaffRole.JUNIOR_ADMIN,
        db_index=True,
        verbose_name=_('Administrative Role'),
    )

    department = models.CharField(
        max_length=30,
        choices=StaffDepartment.choices,
        default=StaffDepartment.OPERATIONS,
        db_index=True,
        verbose_name=_('Department'),
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        validators=[validate_phone_number],
        verbose_name=_('Phone Number'),
    )

    profile_image = models.CharField(
        max_length=500,
        blank=True,
        default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        verbose_name=_('Profile Image URL'),
    )

    is_online = models.BooleanField(
        default=False,
        verbose_name=_('Online Status'),
    )

    failed_login_attempts = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Failed Login Attempts'),
    )

    is_account_locked = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name=_('Is Account Locked'),
    )

    locked_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Locked Until'),
    )

    last_login_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Last Login At'),
    )

    last_logout_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Last Logout At'),
    )

    last_activity_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Last Operational Activity'),
    )

    password_changed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Password Last Changed At'),
    )

    # -------------------------------------------------------------------------
    # Soft Delete & Audit Attributes
    # -------------------------------------------------------------------------
    is_deleted = models.BooleanField(
        default=False,
        db_index=True,
        verbose_name=_('Soft Deleted Flag'),
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_staff_profiles',
        verbose_name=_('Created By User'),
    )

    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_staff_profiles',
        verbose_name=_('Updated By User'),
    )

    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_staff_profiles',
        verbose_name=_('Deleted By User'),
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name=_('Created At'),
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Updated At'),
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Deleted At'),
    )

    # Custom Managers
    objects = StaffProfileManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name = _('Staff Profile')
        verbose_name_plural = _('Staff Profiles')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_deleted', 'role'], name='idx_staff_del_role'),
            models.Index(fields=['is_deleted', 'department'], name='idx_staff_del_dept'),
            models.Index(fields=['is_deleted', 'is_account_locked'], name='idx_staff_del_locked'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(failed_login_attempts__gte=0),
                name='chk_staff_failed_attempts_positive'
            )
        ]

    def __str__(self):
        full_name = self.user.get_full_name() or self.user.username
        return f"{full_name} ({self.employee_id}) - {self.get_role_display()}"

    def soft_delete(self, user=None):
        """Soft deletes the staff profile and deactivates the Django User account."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])
        
        # Deactivate associated Django User to prevent authentication
        self.user.is_active = False
        self.user.save(update_fields=['is_active'])

    def restore(self):
        """Restores a soft-deleted staff profile."""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by'])
        
        # Re-activate associated Django User
        self.user.is_active = True
        self.user.save(update_fields=['is_active'])

    def lock_account(self, lock_minutes=30):
        """Locks account due to brute-force security or administrative action."""
        self.is_account_locked = True
        self.locked_until = timezone.now() + timedelta(minutes=lock_minutes)
        self.save(update_fields=['is_account_locked', 'locked_until'])

    def unlock_account(self):
        """Unlocks account and resets security attempt counters."""
        self.is_account_locked = False
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save(update_fields=['is_account_locked', 'locked_until', 'failed_login_attempts'])

    def increment_failed_attempts(self, max_attempts=5, lock_minutes=30):
        """Increments failed attempt counter and automatically locks if threshold reached."""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= max_attempts:
            self.lock_account(lock_minutes=lock_minutes)
        else:
            self.save(update_fields=['failed_login_attempts'])

    def reset_failed_attempts(self):
        """Resets failed login attempt counter upon successful login."""
        if self.failed_login_attempts > 0:
            self.failed_login_attempts = 0
            self.save(update_fields=['failed_login_attempts'])

    def update_last_activity(self):
        """Updates last operational activity timestamp."""
        self.last_activity_at = timezone.now()
        self.save(update_fields=['last_activity_at'])

     
    from .rbac import RBACRegistry

    @property
    def can_view_dashboard(self):
        return RBACRegistry.has_permission(self.role, "view_dashboard")

    @property
    def can_view_tours(self):
     return RBACRegistry.has_permission(self.role, "view_tours")

    @property
    def can_view_consultants(self):
      return RBACRegistry.has_permission(self.role, "consultants.view")

    @property
    def can_manage_staff(self):
        return RBACRegistry.has_permission(self.role, "staff.view_all")

    @property
    def can_manage_roles(self):
        return RBACRegistry.has_permission(self.role, "roles.manage")

    @property
    def can_view_profile(self):
        return RBACRegistry.has_permission(self.role, "profile.view_own")
    
    @property
    def can_view_bookings(self):
        return RBACRegistry.has_permission(self.role, "bookings.view")
    
    @property
    def can_view_queries(self):
        return RBACRegistry.has_permission(self.role, "queries.view")


class StaffLoginHistory(models.Model):
    """
    Audit log tracking all login and logout session activities for administrative staff.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='login_histories',
        db_index=True,
        verbose_name=_('Staff User'),
    )

    login_time = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name=_('Login Time'),
    )

    logout_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Logout Time'),
    )

    session_key = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_index=True,
        verbose_name=_('Django Session Key'),
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name=_('IP Address'),
    )

    browser = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Browser Client'),
    )

    operating_system = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Operating System'),
    )

    device = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_('Device Category'),
    )

    user_agent = models.TextField(
        blank=True,
        verbose_name=_('Full User Agent String'),
    )

    is_successful = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name=_('Successful Login'),
    )

    logout_reason = models.CharField(
        max_length=50,
        choices=LogoutReason.choices,
        blank=True,
        null=True,
        verbose_name=_('Logout Reason'),
    )

    location = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('Geographic Location'),
    )

    class Meta:
        verbose_name = _('Staff Login History')
        verbose_name_plural = _('Staff Login Histories')
        ordering = ['-login_time']
        indexes = [
            models.Index(fields=['user', '-login_time'], name='idx_login_user_time'),
            models.Index(fields=['ip_address', '-login_time'], name='idx_login_ip_time'),
            models.Index(fields=['session_key'], name='idx_login_session_key'),
        ]

    def __str__(self):
        status_str = "Success" if self.is_successful else "Failed"
        return f"{self.user.username} - {status_str} at {self.login_time.strftime('%Y-%m-%d %H:%M:%S')}"


class AuditLog(models.Model):
    """
    Immutable audit ledger capturing compliance-level data mutation records across the system.
    """

    actor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='actions_performed',
        db_index=True,
        verbose_name=_('Actor / Admin User'),
    )

    action = models.CharField(
        max_length=50,
        choices=AuditAction.choices,
        db_index=True,
        verbose_name=_('Audit Action'),
    )

    target_model = models.CharField(
        max_length=100,
        db_index=True,
        blank=True,
        verbose_name=_('Target Model Name'),
    )

    target_object_id = models.CharField(
        max_length=100,
        db_index=True,
        blank=True,
        verbose_name=_('Target Object ID'),
    )

    target_representation = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_('Target Human String'),
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name=_('Timestamp'),
    )

    old_values = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('Old State Snapshot'),
    )

    new_values = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_('New State Snapshot'),
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        db_index=True,
        verbose_name=_('Client IP Address'),
    )

    session_key = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Session Identifier'),
    )

    user_agent = models.TextField(
        blank=True,
        verbose_name=_('User Agent'),
    )

    description = models.TextField(
        blank=True,
        verbose_name=_('Action Summary / Context'),
    )

    class Meta:
        verbose_name = _('Audit Log')
        verbose_name_plural = _('Audit Logs')
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['actor', '-timestamp'], name='idx_audit_actor_time'),
            models.Index(fields=['action', '-timestamp'], name='idx_audit_action_time'),
            models.Index(fields=['target_model', 'target_object_id'], name='idx_audit_target'),
        ]

    def __str__(self):
        actor_name = self.actor.username if self.actor else "SYSTEM"
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {actor_name} performed {self.action} on {self.target_model}"


class Role(models.Model):
    """
    Dynamic Role definition for Staff RBAC management.
    Allows Super Admins to create, search, update, and delete custom staff roles.
    """
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name=_('Role Code'),
        help_text=_('Unique code identifier e.g. TOUR_MANAGER'),
    )
    name = models.CharField(
        max_length=100,
        verbose_name=_('Role Name'),
        help_text=_('Human-readable role title e.g. Tour & Expedition Manager'),
    )
    description = models.TextField(
        blank=True,
        verbose_name=_('Description'),
    )
    permissions = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_('Granted Permissions'),
        help_text=_('List of RBAC permission keys assigned to this role'),
    )
    is_system_protected = models.BooleanField(
        default=False,
        verbose_name=_('System Protected'),
        help_text=_('System roles cannot be deleted to maintain operational integrity'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Updated At'),
    )

    class Meta:
        verbose_name = _('Role')
        verbose_name_plural = _('Roles')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class RolePermission(models.Model):
    role = models.CharField(
        max_length=30,
        choices=StaffRole.choices
    )

    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        related_name="role_permissions"
    )

    class Meta:
        unique_together = ("role", "permission")
