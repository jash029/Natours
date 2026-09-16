from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from accounts.rbac import permission_required
from accounts.services import AuditService
from accounts.constants import AuditAction
try:
    from .forms import ConsultantUpdateForm
except (ImportError, ModuleNotFoundError):
    try:
        from booking.forms import ConsultantUpdateForm
    except (ImportError, ModuleNotFoundError):
        from forms import ConsultantUpdateForm
        
from api_client.client import APIError

@permission_required('consultants.view')
def consultant_list_view(request):
    search = request.GET.get('search', '')
    status = request.GET.get('status', '')
    page = request.GET.get('page', '1')

    try:
        res = request.api_client.get_consultants(search=search, status=status, page=page)
        consultations = res.get('consultations', [])
        for c in consultations:
            if isinstance(c, dict) and 'id' not in c:
                c['id'] = c.get('_id')
        total_count = res.get('total', len(consultations))
    except APIError as e:
        messages.error(request, str(e.message))
        consultations = []
        total_count = 0

    return render(request, 'consultants/list.html', {
        'consultations': consultations,
        'search': search,
        'status': status,
        'total_count': total_count,
    })


@permission_required('consultants.view')
def consultant_detail_view(request, consultant_id):
    try:
        res = request.api_client.get_consultant(consultant_id)
        consultation = res.get('consultation', {})
    except APIError as e:
        messages.error(request, str(e.message))
        return redirect('consultants:list')

    if request.method == 'POST':
        if not request.user.has_perm and not (request.staff_profile and request.staff_profile.role in ('JUNIOR_ADMIN', 'SUPER_ADMIN', 'SENIOR_ADMIN')):
            messages.error(request, "Access Denied: You lack permission to update consultant requests.")
            return redirect('consultants:list')

        form = ConsultantUpdateForm(request.POST)
        if form.is_valid():
            new_status = form.cleaned_data['status']
            notes = form.cleaned_data['internalNotes']

            try:
                old_status = consultation.get('status')
                request.api_client.update_consultant_status(consultant_id, status=new_status, internalNotes=notes)

                # Audit Log
                action_type = AuditAction.CONSULTATION_RESOLVED if new_status == 'resolved' else AuditAction.CONSULTATION_UPDATE
                AuditService.log_action(
                    request=request,
                    action=action_type,
                    actor=request.user,
                    target_object=None,
                    old_values={'status': old_status},
                    new_values={'status': new_status, 'internalNotes': notes},
                    description=f"Consultation for '{consultation.get('fullName')}' updated to '{new_status}'."
                )

                messages.success(request, f"Consultation request status updated to '{new_status}'.")
                return redirect('consultants:detail', consultant_id=consultant_id)
            except APIError as e:
                messages.error(request, str(e.message))
    else:
        form = ConsultantUpdateForm(initial={
            'status': consultation.get('status', 'pending'),
            'internalNotes': consultation.get('internalNotes', '')
        })

    return render(request, 'consultants/detail.html', {
        'consultation': consultation,
        'form': form,
    })
