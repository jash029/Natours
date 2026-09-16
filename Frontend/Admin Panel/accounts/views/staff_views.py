"""
Staff Management Administrative Views.
Provides listing, detailed viewing, creation, editing, unlocking, and soft-deletion of administrative staff.
"""

from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods

from accounts.decorators import staff_login_required, permission_required, super_admin_required
from accounts.exceptions import StaffNotFoundException
from accounts.forms import StaffCreateForm, StaffUpdateForm, SearchForm
from accounts.models import StaffProfile
from accounts.services.staff_service import StaffManagementService


@permission_required('staff.view_all')
def staff_list_view(request):
    """Displays paginated list of administrative staff profiles with search filters."""
    search_form = SearchForm(request.GET)
    params = {}
    if search_form.is_valid():
        params = search_form.cleaned_data

    qs = StaffManagementService.filter_staff_queryset(params)

    paginator = Paginator(qs, 10)  # 10 records per page
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    form = StaffCreateForm()

    return render(request, 'accounts/staff_list.html', {
        'page_obj': page_obj,
        'search_form': search_form,
        'form': form,
    })


@permission_required('staff.view_all')
def staff_detail_view(request, pk):
    """Renders comprehensive details of a staff profile."""
    profile = get_object_or_404(StaffProfile.objects.select_related('user'), pk=pk)
    return render(request, 'accounts/staff_detail.html', {'profile': profile})


@super_admin_required
@require_http_methods(["GET", "POST"])
def staff_create_view(request):
    """Handles provisioning new staff account."""
    if request.method == 'POST':
        form = StaffCreateForm(request.POST)
        if form.is_valid():
            profile = StaffManagementService.create_staff_member(
                request=request,
                data=form.cleaned_data,
                creator=request.user
            )
            messages.success(request, f"Staff account for '{profile.user.username}' provisioned successfully.")
            return redirect('accounts:staff_list')
    else:
        form = StaffCreateForm()

    return render(request, 'accounts/staff_form.html', {
        'form': form,
        'title': 'Provision New Staff Member',
    })


@permission_required('staff.update')
@require_http_methods(["GET", "POST"])
def staff_edit_view(request, pk):
    """Handles modifying existing staff account details."""
    profile = get_object_or_404(StaffProfile.objects.select_related('user'), pk=pk)
    user = profile.user

    if request.method == 'POST':
        form = StaffUpdateForm(request.POST)
        if form.is_valid():
            try:
                StaffManagementService.update_staff_member(
                    request=request,
                    staff_id=pk,
                    data=form.cleaned_data,
                    modifier=request.user
                )
                messages.success(request, f"Updated profile for '{user.username}'.")
                return redirect('accounts:staff_detail', pk=pk)
            except StaffNotFoundException as e:
                messages.error(request, str(e))
    else:
        form = StaffUpdateForm(initial={
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role,
            'department': profile.department,
            'phone': profile.phone,
        })

    return render(request, 'accounts/staff_form.html', {
        'form': form,
        'profile': profile,
        'title': f"Edit Staff: {user.get_full_name() or user.username}",
    })


@super_admin_required
@require_http_methods(["POST"])
def staff_delete_view(request, pk):
    """Soft deletes staff member."""
    try:
        profile = StaffManagementService.soft_delete_staff(
            request=request,
            staff_id=pk,
            actor=request.user
        )
        messages.success(request, f"Staff profile for '{profile.user.username}' has been deactivated.")
    except StaffNotFoundException as e:
        messages.error(request, str(e))

    return redirect('accounts:staff_list')


@super_admin_required
@require_http_methods(["POST"])
def staff_unlock_view(request, pk):
    """Unlocks a locked staff account."""
    try:
        profile = StaffManagementService.unlock_staff_account(
            request=request,
            staff_id=pk,
            actor=request.user
        )
        messages.success(request, f"Account for '{profile.user.username}' has been unlocked.")
    except StaffNotFoundException as e:
        messages.error(request, str(e))

    return redirect('accounts:staff_detail', pk=pk)
