"""
Utility & Helper Functions for Accounts Application.
"""

from typing import Optional
from django.http import HttpRequest


def get_client_ip(request: HttpRequest) -> str:
    """
    Extracts client IP address safely considering reverse proxies.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '')
    return ip


def get_user_agent(request: HttpRequest) -> str:
    """
    Extracts full HTTP User Agent header string.
    """
    return request.META.get('HTTP_USER_AGENT', '')
