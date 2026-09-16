"""
Custom Domain Exceptions for Accounts Application.
"""

class AccountsBaseException(Exception):
    """Base exception for all accounts domain errors."""
    pass


class AuthenticationFailedException(AccountsBaseException):
    """Raised when authentication credentials are invalid or missing."""
    pass


class AccountLockedException(AccountsBaseException):
    """Raised when a user attempts to log into a locked account."""
    pass


class AccountInactiveException(AccountsBaseException):
    """Raised when a user attempts to log into an inactive/soft-deleted account."""
    pass


class PermissionDeniedException(AccountsBaseException):
    """Raised when an authenticated user lacks required RBAC privileges."""
    pass


class StaffNotFoundException(AccountsBaseException):
    """Raised when a requested staff profile cannot be located."""
    pass


class DuplicateEmployeeIdException(AccountsBaseException):
    """Raised when attempting to create/update staff with a non-unique employee ID."""
    pass


class PasswordValidationException(AccountsBaseException):
    """Raised when password complexity or password reuse checks fail."""
    pass
