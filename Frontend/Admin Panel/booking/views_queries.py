from django.shortcuts import render, redirect
from django.contrib import messages
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
def query_list_view(request):
    search = request.GET.get('search', '')
    category = request.GET.get('category', '')
    status = request.GET.get('status', '')

    try:
        res = request.api_client.get_booking_queries(search=search, category=category, status=status)
        queries = normalize_ids(res.get('queries', []))
    except APIError as e:
        messages.error(request, str(e.message))
        queries = []

    return render(request, 'queries/list.html', {
        'queries': queries,
        'search': search,
        'category': category,
        'status': status,
        'total_count': len(queries)
    })

def query_detail_view(request, query_id):
    try:
        res = request.api_client.get_booking_query(query_id)
        if res.get('status') == 'fail':
            messages.error(request, "Support query not found.")
            return redirect('queries:list')
        query = normalize_ids(res.get('query', {}))
    except APIError as e:
        messages.error(request, str(e.message))
        return redirect('queries:list')

    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'reply':
            message_text = request.POST.get('message', '').strip()
            new_status = request.POST.get('status', '')
            if message_text:
                try:
                    request.api_client.reply_booking_query(query_id, message_text, status=new_status)
                    messages.success(request, "Email reply sent to customer and query status updated.")
                    return redirect('queries:detail', query_id=query_id)
                except APIError as e:
                    messages.error(request, f"Failed to send reply: {str(e.message)}")
            else:
                messages.error(request, "Reply message cannot be empty.")
        elif action == 'update_status':
            new_status = request.POST.get('status', '')
            if new_status:
                try:
                    request.api_client.update_booking_query_status(query_id, new_status)
                    messages.success(request, f"Query status updated to {new_status}.")
                    return redirect('queries:detail', query_id=query_id)
                except APIError as e:
                    messages.error(request, f"Status update failed: {str(e.message)}")

    return render(request, 'queries/detail.html', {'query': query})
