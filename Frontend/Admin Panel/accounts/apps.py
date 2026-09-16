"""
Django AppConfig for Accounts Application.
"""

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """Register signal handlers when Django boots."""
        import accounts.signals  # noqa
