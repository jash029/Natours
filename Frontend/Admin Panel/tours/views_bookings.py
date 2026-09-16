from django.shortcuts import render, redirect
from django.contrib import messages
import json
from api_client.client import APIError

def normalize_ids(data):
    if isinstance(data, list):
        return [normalize_ids(item) for item in data]

    if isinstance(data, dict):
        normalized = {}

        for key, value in data.items():
            if key == "_id":
                normalized["id"] = value
            else:
                normalized[key] = normalize_ids(value)

        return normalized

    return data

def booking_list_view(request):
    search = request.GET.get('search', '')
    booking_status = request.GET.get('booking_status', '')
    payment_status = request.GET.get('payment_status', '')
    verification_status = request.GET.get('verification_status', '')

    try:
        res = request.api_client.get_bookings(
            search=search,
            booking_status=booking_status,
            payment_status=payment_status,
            verification_status=verification_status
        )

        bookings = normalize_ids(res.get("bookings", []))

    except APIError as e:
        messages.error(request, str(e.message))
        bookings = []

    return render(request, 'bookings/list.html', {
        'bookings': bookings,
        'search': search,
        'booking_status': booking_status,
        'payment_status': payment_status,
        'verification_status': verification_status,
        'total_count': len(bookings)
    })

def booking_detail_view(request, booking_id):
    try:
        res = request.api_client.get_booking_details(booking_id)
        if res.get('status') == 'fail':
            messages.error(request, "Booking not found.")
            return redirect('bookings:list')
        booking = res.get('booking', {})
    except APIError as e:
        messages.error(request, str(e.message))
        return redirect('bookings:list')

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'verify_documents':
            # Collect document decision parameters from form
            # e.g., traveler_0_passport_action = 'verify'|'reject'
            decisions = []
            travelers = booking.get('travelers', [])

            for t_idx, traveler in enumerate(travelers):
                for doc_type in ['passport', 'nationalId', 'visa', 'insurance']:
                    act_key = f"t_{t_idx}_{doc_type}_action"
                    reason_key = f"t_{t_idx}_{doc_type}_reason"
                    
                    if act_key in request.POST:
                        act_val = request.POST.get(act_key)
                        reason_val = request.POST.get(reason_key, '')
                        if act_val in ['verify', 'reject']:
                            decisions.append({
                                'travelerIndex': t_idx,
                                'docType': doc_type,
                                'action': act_val,
                                'reason': reason_val
                            })

            contact_phone = request.POST.get('contact_phone', '+91 91111 11111')

            try:
                res_v = request.api_client.verify_booking_documents(booking_id, decisions, contact_phone=contact_phone)
                msg = res_v.get('message', 'Document verification updated successfully.')
                messages.success(request, msg)
                return redirect('bookings:detail', booking_id=booking_id)
            except APIError as e:
                messages.error(request, f"Document verification failed: {str(e.message)}")

        elif action == 'mark_full_paid':
            try:
                request.api_client.mark_booking_payment_full_paid(booking_id)
                messages.success(request, "Payment status updated to FULL PAID successfully. Confirmation email sent.")
                return redirect('bookings:detail', booking_id=booking_id)
            except APIError as e:
                messages.error(request, f"Payment status update failed: {str(e.message)}")

        elif action == 'mark_journey_status':
            new_status = request.POST.get('booking_status', 'completed')
            try:
                request.api_client.mark_booking_journey_completed(booking_id, status=new_status)
                messages.success(request, f"Booking status marked as {new_status}. Customer review option enabled.")
                return redirect('bookings:detail', booking_id=booking_id)
            except APIError as e:
                messages.error(request, f"Booking status update failed: {str(e.message)}")

    return render(request, 'bookings/detail.html', {'booking': booking})
