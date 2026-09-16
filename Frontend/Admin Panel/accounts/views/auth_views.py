"""
Authentication Views for Enterprise Accounts.
Thin HTTP presentation layer delegating business logic to AuthenticationService.
"""

from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods

from accounts.exceptions import (
    AuthenticationFailedException,
    AccountLockedException,
    AccountInactiveException,
)
from accounts.forms import LoginForm, ForgotPasswordForm, ResetPasswordForm, StaffSignupForm
from accounts.services.auth_service import AuthenticationService
from accounts.services.staff_service import StaffManagementService


def signup_view(request):
    """Disables public self-registration per enterprise security requirements."""
    messages.warning(request, "Public registration is disabled. Staff accounts must be provisioned by a Super Admin.")
    return redirect('accounts:login')



@require_http_methods(["GET", "POST"])
def login_view(request):
    """Handles staff login requests."""
    if request.user.is_authenticated:
        return redirect('dashboard:index')

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email_or_username = form.cleaned_data['email_or_username']
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data.get('remember_me', False)

            try:
                user = AuthenticationService.authenticate_staff(
                    request=request,
                    email_or_username=email_or_username,
                    password=password,
                    remember_me=remember_me
                )
                role_display = user.staff_profile.get_role_display() if hasattr(user, 'staff_profile') else 'Administrator'
                messages.success(request, f"Welcome back, {user.get_full_name() or user.username}! Authenticated as {role_display}.")
                return redirect('dashboard:index')

            except AuthenticationFailedException as e:
                messages.error(request, str(e))
            except AccountLockedException as e:
                messages.error(request, str(e))
            except AccountInactiveException as e:
                messages.error(request, str(e))
    else:
        form = LoginForm()

    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    """Handles staff logout."""
    AuthenticationService.logout_staff(request)
    messages.info(request, "You have been securely logged out of the enterprise administration panel.")
    return redirect('accounts:login')


@require_http_methods(["GET", "POST"])
def forgot_password_view(request):
    """Handles password reset request submission."""
    if request.method == 'POST':
        form = ForgotPasswordForm(request.POST)
        if form.is_valid():
            messages.success(request, "If your email address is registered, password reset instructions have been sent.")
            return redirect('accounts:login')
    else:
        form = ForgotPasswordForm()

    return render(request, 'accounts/forgot_password.html', {'form': form})


@require_http_methods(["GET", "POST"])
def reset_password_view(request):
    """Handles password reset confirmation execution."""
    if request.method == 'POST':
        form = ResetPasswordForm(request.POST)
        if form.is_valid():
            messages.success(request, "Your password has been successfully reset. Please log in with your new credentials.")
            return redirect('accounts:login')
    else:
        form = ResetPasswordForm()

    return render(request, 'accounts/reset_password.html', {'form': form})
