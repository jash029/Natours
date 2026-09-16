"""
Enterprise Permission Verification Utilities.
"""

from typing import Optional
from django.contrib.auth.models import User
from .rbac import RBACRegistry
from .constants import StaffRole


class StaffPermissionEvaluator:
    """
    Service class responsible for evaluating RBAC permissions for a staff user context.
    """

    @staticmethod
    def has_permission(user: Optional[User], required_permission: str) -> bool:
        """
        Evaluates if the given user possesses the specified RBAC permission string.
        """
        if not user or not user.is_authenticated or not user.is_active:
            return False

        if user.is_superuser:
            return True

        if not hasattr(user, 'staff_profile') or user.staff_profile.is_deleted:
            return False

        profile = user.staff_profile
        if profile.is_account_locked:
            return False

        return RBACRegistry.has_permission(profile.role, required_permission)

    @staticmethod
    def is_super_admin(user: Optional[User]) -> bool:
        """Checks if user holds Super Admin status."""
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if user.is_superuser:
            return True
        if hasattr(user, 'staff_profile'):
            return user.staff_profile.role == StaffRole.SUPER_ADMIN
        return False
