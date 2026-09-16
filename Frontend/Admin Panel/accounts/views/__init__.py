from .auth_views import (
    login_view,
    logout_view,
    signup_view,
    forgot_password_view,
    reset_password_view,
)
from .profile_views import (
    profile_view,
    change_password_view,
)
from .role_views import (
    role_list_view,
    role_create_view,
    role_edit_view,
    role_delete_view,
    api_roles_list,
)
from .staff_views import (
    staff_list_view,
    staff_detail_view,
    staff_create_view,
    staff_edit_view,
    staff_delete_view,
    staff_unlock_view,
)
