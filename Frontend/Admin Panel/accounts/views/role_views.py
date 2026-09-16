"""
Role Management Administrative Views.
Allows Super Admins to search, create, update, and delete custom staff roles and permissions.
"""

from django.http import request
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Q
from accounts.decorators import super_admin_required, permission_required
from accounts.forms import RoleForm, RoleSearchForm
from accounts.models import Role, StaffProfile,RolePermission, Permission
from accounts.rbac import RBACRegistry


@super_admin_required
@require_http_methods(["GET"])
def role_list_view(request):
    """Displays searchable list of system roles."""

    # Ensure system roles exist
    static_roles = [
        (
            "SUPER_ADMIN",
            "Super Admin",
            "Full unrestricted administrative oversight.",
        ),
        (
            "SENIOR_ADMIN",
            "Senior Admin",
            "Tour catalog management and operational management.",
        ),
        (
            "JUNIOR_ADMIN",
            "Junior Admin",
            "Consultation request handling and basic access.",
        ),
    ]

    for code, name, desc in static_roles:
        Role.objects.get_or_create(
            code=code,
            defaults={
                "name": name,
                "description": desc,
                "is_system_protected": True,
            },
        )

    search_form = RoleSearchForm(request.GET)
    qs = Role.objects.all()

    if search_form.is_valid():
        q = search_form.cleaned_data.get("q")
        if q:
            qs = qs.filter(
                 Q(name__icontains=q)
                | Q(code__icontains=q)
                | Q(description__icontains=q)
            )

    roles_data = []

    for role_obj in qs:

        assigned_count = StaffProfile.objects.filter(
            role=role_obj.code,
            is_deleted=False,
        ).count()

        permissions = RolePermission.objects.filter(
            role=role_obj.code
        ).select_related("permission")

        roles_data.append({
            "obj": role_obj,
            "assigned_count": assigned_count,
            "permissions_count": permissions.count(),
            "permissions": permissions,
        })

    return render(
        request,
        "accounts/role_list.html",
        {
            "roles_data": roles_data,
            "search_form": search_form,
        },
    )


@super_admin_required
@require_http_methods(["GET", "POST"])
def role_create_view(request):
    """Handles creating a new custom role with specific permissions."""
    if request.method == 'POST':
        form = RoleForm(request.POST)
        if form.is_valid():
            role_obj = form.save(commit=False)
            selected_perms = request.POST.getlist('permissions')
            role_obj.permissions = selected_perms
            role_obj.save()
            messages.success(request, f"Custom Role '{role_obj.name}' created successfully with {len(selected_perms)} assigned permissions.")
            return redirect('accounts:role_list')
    else:
        form = RoleForm()

    return render(request, 'accounts/role_form.html', {
        'form': form,
        'available_permissions': RBACRegistry.AVAILABLE_PERMISSIONS,
        'assigned_permissions': [],
        'title': 'Create New Staff Role',
    })


@super_admin_required
@require_http_methods(["GET", "POST"])
def role_edit_view(request, pk):
    """Allows editing permissions assigned to a role."""

    role_obj = get_object_or_404(Role, pk=pk)

    if request.method == "POST":

        selected_permission_ids = request.POST.getlist("permissions")

        # Remove existing permissions
        RolePermission.objects.filter(
            role=role_obj.code
        ).delete()

        # Assign selected permissions
        RolePermission.objects.bulk_create([
            RolePermission(
                role=role_obj.code,
                permission_id=permission_id
            )
            for permission_id in selected_permission_ids
        ])

        messages.success(
            request,
            f"Permissions for '{role_obj.name}' updated successfully."
        )

        return redirect("accounts:role_list")

    available_permissions = Permission.objects.order_by(
        "category",
        "name"
    )

    assigned_permissions = set(
        RolePermission.objects.filter(
            role=role_obj.code
        ).values_list(
            "permission_id",
            flat=True
        )
    )

    return render(
        request,
        "accounts/role_form.html",
        {
            "role": role_obj,
            "available_permissions": available_permissions,
            "assigned_permissions": assigned_permissions,
            "title": f"Edit Permissions - {role_obj.name}",
        },
    )


@super_admin_required
@require_http_methods(["POST"])
def role_delete_view(request, pk):
    """Deletes a custom role if it is not system protected or currently assigned."""
    role_obj = get_object_or_404(Role, pk=pk)

    if role_obj.is_system_protected:
        messages.error(request, f"Role '{role_obj.name}' is system-protected and cannot be deleted.")
        return redirect('accounts:role_list')

    assigned_count = StaffProfile.objects.filter(role=role_obj.code, is_deleted=False).count()
    if assigned_count > 0:
        messages.error(request, f"Cannot delete role '{role_obj.name}' because it is assigned to {assigned_count} active staff profile(s). Reassign those staff members first.")
        return redirect('accounts:role_list')

    role_name = role_obj.name
    role_obj.delete()
    messages.success(request, f"Role '{role_name}' deleted successfully.")
    return redirect('accounts:role_list')


# =======================================================
# ROLE & STAFF REST API ENDPOINTS
# =======================================================

@super_admin_required
def api_roles_list(request):
    """JSON API returning list of all roles and permissions."""
    qs = Role.objects.all()
    roles = [{
        'id': r.id,
        'code': r.code,
        'name': r.name,
        'description': r.description,
        'permissions': r.permissions,
        'is_system_protected': r.is_system_protected,
    } for r in qs]
    return JsonResponse({'status': 'success', 'roles': roles, 'count': len(roles)})
