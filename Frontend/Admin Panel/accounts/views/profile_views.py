"""
Profile Management Views.
Presents personal staff details and handles profile and password updates.
"""

from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods

from accounts.decorators import staff_login_required
from accounts.exceptions import PasswordValidationException
from accounts.forms import ProfileUpdateForm, ChangePasswordForm
from accounts.services.profile_service import ProfileService


@staff_login_required
@require_http_methods(["GET", "POST"])
def profile_view(request):
    """Renders and updates staff member's personal profile."""
    user = request.user
    profile = user.staff_profile

    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, instance=profile, initial={
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        })
        if form.is_valid():
            ProfileService.update_profile(
                request=request,
                user=user,
                data=form.cleaned_data
            )
            messages.success(request, "Your profile information has been updated successfully.")
            return redirect('accounts:profile')
    else:
        form = ProfileUpdateForm(instance=profile, initial={
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        })

  
    pwd_form = ChangePasswordForm()
    return render(request, 'accounts/profile.html', {
        'form': form,
        'profile': profile,
        'pwd_form': pwd_form,
    })


@staff_login_required
@require_http_methods(["GET", "POST"])
def change_password_view(request):
    """Handles personal password update workflow."""
    if request.method == 'POST':
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            try:
                ProfileService.change_password(
                    request=request,
                    user=request.user,
                    current_pass=form.cleaned_data['current_password'],
                    new_pass=form.cleaned_data['new_password']
                )
                messages.success(request, "Password updated successfully.")
                return redirect('accounts:profile')
            except PasswordValidationException as e:
                messages.error(request, str(e))
    else:
        form = ChangePasswordForm()

    return render(request, 'accounts/change_password.html', {'form': form})
