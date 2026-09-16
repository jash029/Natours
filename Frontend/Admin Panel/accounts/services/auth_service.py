"""
Enterprise Authentication Service.
Handles administrative staff authentication, session key creation, lockout policies, and login attempt auditing.
"""

from typing import Tuple, Optional
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.utils import timezone

from accounts.constants import AuditAction, LogoutReason, StaffRole, StaffDepartment
from accounts.exceptions import (
    AuthenticationFailedException,
    AccountLockedException,
    AccountInactiveException,
)
from accounts.models import StaffProfile, StaffLoginHistory
from .audit_service import AuditService


class AuthenticationService:
    """Service encapsulating authentication workflow logic and session lifecycle."""

    @classmethod
    def authenticate_staff(
        cls, request: HttpRequest, email_or_username: str, password: str, remember_me: bool = False
    ) -> User:
        """
        Authenticates a staff member against Django ORM/SQLite and records session history.
        Enforces lockout and active user checks.
        """
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0] or request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # Resolve Django user by email or username
        user_obj = None
        try:
            if '@' in email_or_username:
                user_obj = User.objects.get(email__iexact=email_or_username)
            else:
                user_obj = User.objects.get(username__iexact=email_or_username)
        except User.DoesNotExist:
            # Fallback check for seed administrator if no DB record exists
            if (email_or_username in ['admin@natours.com', 'admin']) and (password in ['admin123', 'password123']):
                user_obj, _ = User.objects.get_or_create(
                    username='admin',
                    defaults={
                        'email': 'admin@natours.com',
                        'first_name': 'System',
                        'last_name': 'Administrator',
                        'is_staff': True,
                        'is_superuser': True,
                    }
                )
                user_obj.set_password('admin123')
                user_obj.save()

        if not user_obj:
            AuditService.log_action(
                request=request,
                action=AuditAction.LOGIN_FAILED,
                description=f"Failed login attempt for unknown account identifier '{email_or_username}'"
            )
            raise AuthenticationFailedException("Invalid credentials provided.")

        # Ensure StaffProfile exists
        profile, created = StaffProfile.objects.all_with_deleted().get_or_create(
            user=user_obj,
            defaults={
                'role': StaffRole.SUPER_ADMIN if user_obj.is_superuser else StaffRole.JUNIOR_ADMIN,
                'department': StaffDepartment.EXECUTIVE if user_obj.is_superuser else StaffDepartment.OPERATIONS,
            }
        )

        # Pre-check soft-delete status
        if profile.is_deleted or not user_obj.is_active:
            raise AccountInactiveException("Administrative account is deactivated. Contact security.")

        # Pre-check lockout status
        if profile.is_account_locked:
            if profile.locked_until and timezone.now() > profile.locked_until:
                profile.unlock_account()
            else:
                raise AccountLockedException(f"Account is locked due to multiple security failures until {profile.locked_until}.")

        # Perform password authentication
        authenticated_user = authenticate(request, username=user_obj.username, password=password)

        if not authenticated_user:
            profile.increment_failed_attempts()
            AuditService.log_action(
                request=request,
                action=AuditAction.LOGIN_FAILED,
                actor=user_obj,
                description=f"Invalid password entered for staff user '{user_obj.username}'"
            )
            raise AuthenticationFailedException("Invalid email/username or password.")

        # Authentication Success
        profile.reset_failed_attempts()
        profile.last_login_at = timezone.now()
        profile.is_online = True
        profile.save(update_fields=['last_login_at', 'is_online'])

        login(request, authenticated_user)

        # Set Session Expiry
        if remember_me:
            request.session.set_expiry(2592000)  # 30 days
        else:
            request.session.set_expiry(28800)     # 8 hours

        # Record Login History
        StaffLoginHistory.objects.create(
            user=authenticated_user,
            session_key=request.session.session_key,
            ip_address=ip_address,
            user_agent=user_agent,
            is_successful=True,
        )

        AuditService.log_action(
            request=request,
            action=AuditAction.LOGIN_SUCCESS,
            actor=authenticated_user,
            target_object=profile,
            description=f"Staff user '{authenticated_user.username}' successfully authenticated."
        )

        return authenticated_user

    @classmethod
    def logout_staff(cls, request: HttpRequest, reason: str = LogoutReason.USER_LOGOUT):
        """Logs out administrative staff member and closes session context."""
        user = request.user
        if user and user.is_authenticated:
            if hasattr(user, 'staff_profile'):
                profile = user.staff_profile
                profile.is_online = False
                profile.last_logout_at = timezone.now()
                profile.save(update_fields=['is_online', 'last_logout_at'])

            # Update Login History with logout time & reason
            sess_key = request.session.session_key
            if sess_key:
                StaffLoginHistory.objects.filter(user=user, session_key=sess_key).update(
                    logout_time=timezone.now(),
                    logout_reason=reason
                )

            AuditService.log_action(
                request=request,
                action=AuditAction.LOGOUT,
                actor=user,
                description=f"Staff user '{user.username}' logged out. Reason: {reason}"
            )

        logout(request)
