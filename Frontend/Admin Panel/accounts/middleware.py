"""
Enterprise Administrative Staff Middleware.
Attaches staff profile to request context, tracks last activity timestamp,
captures client IP & User-Agent metadata, and initializes Node backend API client.
"""

from django.utils import timezone
from api_client.client import TravelAPIClient


class StaffAuthMiddleware:
    """
    Middleware injecting staff context, enforcing session activity timestamps,
    and managing administrative API client instances.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Attach reusable REST client for Node.js backend integration
        request.api_client = TravelAPIClient()

        # Contextualize authenticated user profile
        if hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'staff_profile'):
                profile = request.user.staff_profile
                
                # Check for activity timestamp throttling (update at most once per 60 seconds)
                now = timezone.now()
                if not profile.last_activity_at or (now - profile.last_activity_at).total_seconds() > 60:
                    profile.update_last_activity()

                request.staff_profile = profile
            else:
                request.staff_profile = None
        else:
            request.staff_profile = None

        response = self.get_response(request)
        return response
