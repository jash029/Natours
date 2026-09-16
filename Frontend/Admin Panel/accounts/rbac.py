"""
Enterprise Role-Based Access Control (RBAC) Mapping & Definitions.
"""

from typing import Dict, List, Set, Callable, Optional
from .constants import StaffRole


class RBACRegistry:
    """
    Central registry defining hierarchical permissions per staff role.
    Supports both default system static roles and dynamic database-backed roles.
    """


    @classmethod
    def get_role_permissions(cls, role: str) -> Set[str]:
        from .models import RolePermission
        return set(
           RolePermission.objects.filter(role=role)
           .values_list("permission__code", flat=True)
        )
        #  return cls.PERMISSIONS.get(role, set())

    @classmethod
    def has_permission(cls, role: str, permission: str) -> bool:
        """Checks if a role grants a specific permission."""
        if role in (StaffRole.SUPER_ADMIN, 'Super Admin', 'SUPER_ADMIN'):
            return True  # Super Admin short-circuit override
        return permission in cls.get_role_permissions(role)

    @classmethod
    def get_all_roles(cls) -> List[str]:
        """Returns list of valid system role identifiers."""
        roles = list(StaffRole.values)
        try:
            from .models import Role
            for r in Role.objects.all():
                if r.code not in roles and r.name not in roles:
                    roles.append(r.code)
        except Exception:
            pass
        return roles



def permission_required(permission_string: str = "") -> Callable:
    """
    Decorator asserting that the logged-in staff member possesses a specific RBAC permission.
    Re-exported in accounts.rbac for backward compatibility with app view imports.
    """
    from .decorators import permission_required as _permission_required
    return _permission_required(permission_string)


def staff_login_required(view_func: Optional[Callable] = None) -> Callable:
    """
    Decorator requiring an active authenticated Django staff session.
    Re-exported in accounts.rbac for backward compatibility.
    """
    from .decorators import staff_login_required as _staff_login_required
    return _staff_login_required(view_func)


def super_admin_required(view_func: Optional[Callable] = None) -> Callable:
    """
    Decorator asserting that the user is a Super Admin.
    Re-exported in accounts.rbac for backward compatibility.
    """
    from .decorators import super_admin_required as _super_admin_required
    return _super_admin_required(view_func)
