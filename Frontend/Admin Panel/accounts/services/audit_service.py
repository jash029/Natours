"""
Enterprise Audit Service.
Encapsulates non-repudiable audit logging, snapshot tracking, and compliance histories.
"""

from typing import Any, Dict, Optional
from django.contrib.auth.models import User
from django.http import HttpRequest
from accounts.constants import AuditAction
from accounts.models import AuditLog


class AuditService:
    """Service handling compliance audit logging and history tracking."""

    @staticmethod
    def log_action(
        request: Optional[HttpRequest],
        action: str,
        actor: Optional[User] = None,
        target_object: Any = None,
        old_values: Optional[Dict[str, Any]] = None,
        new_values: Optional[Dict[str, Any]] = None,
        description: str = '',
    ) -> AuditLog:
        """
        Creates an immutable AuditLog entry capturing state mutation snapshots.
        """
        user_actor = actor
        ip_addr = None
        sess_key = None
        agent = ''

        if request:
            if not user_actor and request.user and request.user.is_authenticated:
                user_actor = request.user
            ip_addr = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0] or request.META.get('REMOTE_ADDR')
            sess_key = request.session.session_key if hasattr(request, 'session') else None
            agent = request.META.get('HTTP_USER_AGENT', '')[:500]

        target_model = ''
        target_id = ''
        target_repr = ''

        if target_object:
            target_model = target_object.__class__.__name__
            target_id = str(getattr(target_object, 'pk', ''))
            target_repr = str(target_object)[:255]

        audit_entry = AuditLog.objects.create(
            actor=user_actor,
            action=action,
            target_model=target_model,
            target_object_id=target_id,
            target_representation=target_repr,
            old_values=old_values or {},
            new_values=new_values or {},
            ip_address=ip_addr,
            session_key=sess_key,
            user_agent=agent,
            description=description,
        )
        return audit_entry
