"""
View Decorators for Enterprise Authentication & Role Authorization.
"""

from functools import wraps
from typing import Callable, Optional
from django.contrib import messages
from django.shortcuts import redirect
from .permissions import StaffPermissionEvaluator
from .exceptions import PermissionDeniedException


def staff_login_required(view_func: Optional[Callable] = None):
    """
    Decorator requiring an active authenticated Django staff session.
    Redirects to login if unauthenticated or locked out.
    Supports both @staff_login_required and @staff_login_required().
    """
    def decorator(fn):
        @wraps(fn)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated or not request.user.is_active:
                messages.warning(request, "Please log in with active staff credentials to access this administrative section.")
                return redirect('accounts:login')

            if hasattr(request.user, 'staff_profile'):
                profile = request.user.staff_profile
                if profile.is_deleted:
                    messages.error(request, "Your administrative account has been deactivated.")
                    return redirect('accounts:login')
                if profile.is_account_locked:
                    messages.error(request, f"Your account is locked until {profile.locked_until.strftime('%H:%M:%S')} due to security violations.")
                    return redirect('accounts:login')

            return fn(request, *args, **kwargs)
        return _wrapped_view

    if view_func is None:
        return decorator
    if callable(view_func):
        return decorator(view_func)
    return decorator


def permission_required(permission_string: str = ""):
    """
    Decorator asserting that the logged-in staff member possesses a specific RBAC permission.
    Supports @permission_required('perm') and @permission_required.
    """
    if callable(permission_string):
        fn = permission_string
        @wraps(fn)
        @staff_login_required
        def _wrapped_view(request, *args, **kwargs):
            return fn(request, *args, **kwargs)
        return _wrapped_view

    def decorator(view_func):
        @wraps(view_func)
        @staff_login_required
        def _wrapped_view(request, *args, **kwargs):
            if permission_string and not StaffPermissionEvaluator.has_permission(request.user, permission_string):
                messages.error(request, f"Access Denied: You lack the required permission '{permission_string}'.")
                return redirect('dashboard:index')
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator


def super_admin_required(view_func: Optional[Callable] = None):
    """
    Decorator asserting that the user is a Super Admin.
    Supports both @super_admin_required and @super_admin_required().
    """
    def decorator(fn):
        @wraps(fn)
        @staff_login_required
        def _wrapped_view(request, *args, **kwargs):
            if not StaffPermissionEvaluator.is_super_admin(request.user):
                messages.error(request, "Access Restricted: Super Admin privilege required.")
                return redirect('dashboard:index')
            return fn(request, *args, **kwargs)
        return _wrapped_view

    if view_func is None:
        return decorator
    if callable(view_func):
        return decorator(view_func)
    return decorator
