"""
Enterprise Staff Management Service.
Handles administrative staff provisioning, updates, soft-deletes, role changes, and search filtering.
"""

from accounts.views import profile_views
from typing import Dict, Any, Tuple
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q, QuerySet
from django.http import HttpRequest
from django.utils import timezone

from accounts.constants import AuditAction, StaffRole, StaffDepartment
from accounts.exceptions import DuplicateEmployeeIdException, StaffNotFoundException
from accounts import models
from .audit_service import AuditService


class StaffManagementService:
    """Service class handling administrative staff user lifecycles."""

    @classmethod
    def filter_staff_queryset(cls, params: Dict[str, Any]) -> QuerySet:
        """
        Builds optimized QuerySet for staff list views using select_related to prevent N+1 queries.
        """
        qs = models.StaffProfile.objects.select_related('user', 'created_by', 'updated_by').all()

        q_search = params.get('q')
        if q_search:
            qs = qs.filter(
                Q(user__username__icontains=q_search) |
                Q(user__first_name__icontains=q_search) |
                Q(user__last_name__icontains=q_search) |
                Q(user__email__icontains=q_search) |
                Q(employee_id__icontains=q_search)
            )

        role_filter = params.get('role')
        if role_filter:
            qs = qs.filter(role=role_filter)

        dept_filter = params.get('department')
        if dept_filter:
            qs = qs.filter(department=dept_filter)

        return qs

    @classmethod
    @transaction.atomic
    def create_staff_member(
        cls, request: HttpRequest, data: Dict[str, Any], creator: User
    ) -> models.StaffProfile:
        """Provisions a new staff user and associated domain profile."""
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            is_staff=True,
            is_active=True,
        )

        profile = user.staff_profile

        profile.role = data.get("role", StaffRole.JUNIOR_ADMIN)
        profile.department = data.get("department", StaffDepartment.OPERATIONS)
        profile.created_by = creator
        profile.updated_by = creator

        emp_id = data.get("employee_id")
        if emp_id:
            profile.employee_id = emp_id

        profile.save()

        AuditService.log_action(
            request=request,
            action=AuditAction.CREATE,
            actor=creator,
            target_object=profile,
            new_values={'username': user.username, 'email': user.email, 'role': profile.role},
            description=f"Provisioned new staff user '{user.username}' with role {profile.role}."
        )

        return profile

    @classmethod
    @transaction.atomic
    def update_staff_member(
        cls, request: HttpRequest, staff_id: int, data: Dict[str, Any], modifier: User
    ) -> models.StaffProfile:
        """Updates staff profile and role attributes."""
        try:
            profile = models.StaffProfile.objects.select_related('user').get(pk=staff_id)
        except models.StaffProfile.DoesNotExist:
            raise StaffNotFoundException(f"Staff profile with ID {staff_id} does not exist.")

        user = profile.user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save(update_fields=['first_name', 'last_name'])

        profile.role = data.get('role', profile.role)
        profile.department = data.get('department', profile.department)
        if 'phone' in data:
            profile.phone = data['phone']
        profile.updated_by = modifier
        profile.save()

        AuditService.log_action(
            request=request,
            action=AuditAction.UPDATE,
            actor=modifier,
            target_object=profile,
            description=f"Updated staff profile for '{user.username}'."
        )

        return profile

    @classmethod
    @transaction.atomic
    def soft_delete_staff(
        cls, request: HttpRequest, staff_id: int, actor: User
    ) -> models.StaffProfile:
        """Soft deletes staff member and revokes user access."""
        try:
            profile = models.StaffProfile.objects.get(pk=staff_id)
        except models.StaffProfile.DoesNotExist:
            raise StaffNotFoundException(f"Staff profile with ID {staff_id} does not exist.")

        profile.soft_delete(user=actor)

        AuditService.log_action(
            request=request,
            action=AuditAction.DELETE,
            actor=actor,
            target_object=profile,
            description=f"Soft-deleted staff member '{profile.user.username}'."
        )

        return profile

    @classmethod
    @transaction.atomic
    def unlock_staff_account(
        cls, request: HttpRequest, staff_id: int, actor: User
    ) -> models.StaffProfile:
        """Unlocks staff account locked out by security policy."""
        try:
            profile = models.StaffProfile.objects.get(pk=staff_id)
        except models.StaffProfile.DoesNotExist:
            raise StaffNotFoundException(f"Staff profile with ID {staff_id} does not exist.")

        profile.unlock_account()

        AuditService.log_action(
            request=request,
            action=AuditAction.ACCOUNT_UNLOCK,
            actor=actor,
            target_object=profile,
            description=f"Unlocked account for staff member '{profile.user.username}'."
        )

        return profile
