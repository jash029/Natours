"""
URL Routing Specification for Accounts Application.
"""

from django.urls import path
from .views import (
    login_view,
    logout_view,
    signup_view,
    forgot_password_view,
    reset_password_view,
    profile_view,
    change_password_view,
    staff_list_view,
    staff_detail_view,
    staff_create_view,
    staff_edit_view,
    staff_delete_view,
    staff_unlock_view,
    role_list_view,
    role_create_view,
    role_edit_view,
    role_delete_view,
    api_roles_list,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication Endpoints
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('signup/', signup_view, name='signup'),
    path('forgot-password/', forgot_password_view, name='forgot_password'),
    path('reset-password/', reset_password_view, name='reset_password'),

    # Staff Profile Endpoints
    path('profile/', profile_view, name='profile'),
    path('profile/change-password/', change_password_view, name='change_password'),

    # Administrative Staff Management Endpoints
    path('staff/', staff_list_view, name='staff_list'),
    path('staff/create/', staff_create_view, name='staff_create'),
    path('staff/<int:pk>/', staff_detail_view, name='staff_detail'),
    path('staff/<int:pk>/edit/', staff_edit_view, name='staff_edit'),
    path('staff/<int:pk>/delete/', staff_delete_view, name='staff_delete'),
    path('staff/<int:pk>/unlock/', staff_unlock_view, name='staff_unlock'),

    # Role Management Endpoints (Super Admin)
    path('roles/', role_list_view, name='role_list'),
    path('roles/create/', role_create_view, name='role_create'),
    path('roles/<int:pk>/edit/', role_edit_view, name='role_edit'),
    path('roles/<int:pk>/delete/', role_delete_view, name='role_delete'),

    # JSON API Endpoints
    path('api/roles/', api_roles_list, name='api_roles_list'),
]
