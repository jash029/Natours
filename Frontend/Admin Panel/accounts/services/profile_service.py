"""
Enterprise Profile Service.
Handles personal staff profile updates, password changes, and personal security settings.
"""

from typing import Dict, Any
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.db import transaction
from django.http import HttpRequest
from django.utils import timezone

from accounts.constants import AuditAction
from accounts.exceptions import PasswordValidationException
from accounts.models import  StaffProfile
from .audit_service import AuditService


class ProfileService:
    """Service handling personal staff profile management operations."""

    @classmethod
    @transaction.atomic
    def update_profile(
        cls, request: HttpRequest, user: User, data: Dict[str, Any]
    ) -> StaffProfile:
        """Updates staff profile personal details and captures old/new snapshots."""
        profile = user.staff_profile

        old_snapshot = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': profile.phone,
            'profile_image': profile.profile_image,
        }

        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save(update_fields=['first_name', 'last_name'])

        profile.phone = data.get('phone', profile.phone)
        if data.get('profile_image'):
            profile.profile_image = data['profile_image']
        profile.updated_by = user
        profile.save()

        new_snapshot = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': profile.phone,
            'profile_image': profile.profile_image,
        }

        AuditService.log_action(
            request=request,
            action=AuditAction.UPDATE,
            actor=user,
            target_object=profile,
            old_values=old_snapshot,
            new_values=new_snapshot,
            description=f"Staff member '{user.username}' updated profile information."
        )

        return profile

    @classmethod
    @transaction.atomic
    def change_password(
        cls, request: HttpRequest, user: User, current_pass: str, new_pass: str
    ) -> None:
        """Changes user password, validates old password, and updates session authentication hash."""
        if not user.check_password(current_pass):
            raise PasswordValidationException("Current password provided is incorrect.")

        old_hash_prefix = user.password[:15]
        user.set_password(new_pass)
        user.save(update_fields=['password'])

        # Keep current session valid without logging out user
        update_session_auth_hash(request, user)

        profile = user.staff_profile
        profile.password_changed_at = timezone.now()
        profile.save(update_fields=['password_changed_at'])

        AuditService.log_action(
            request=request,
            action=AuditAction.PASSWORD_CHANGE,
            actor=user,
            target_object=profile,
            description=f"Staff member '{user.username}' changed account password."
        )
