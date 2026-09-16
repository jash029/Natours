from django.db import models
from django.utils.translation import gettext_lazy as _


class StaffRole(models.TextChoices):
    JUNIOR_ADMIN = 'JUNIOR_ADMIN', _('Junior Admin')
    SENIOR_ADMIN = 'SENIOR_ADMIN', _('Senior Admin')
    SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')


class StaffDepartment(models.TextChoices):
    EXECUTIVE = 'EXECUTIVE', _('Executive Management')
    OPERATIONS = 'OPERATIONS', _('Operations & Logistics')
    SUPPORT = 'SUPPORT', _('Customer Support & Concierge')
    IT = 'IT', _('Information Technology & Security')
    FINANCE = 'FINANCE', _('Finance & Billing')


class LogoutReason(models.TextChoices):
    USER_LOGOUT = 'USER_LOGOUT', _('User Initiated Logout')
    SESSION_TIMEOUT = 'SESSION_TIMEOUT', _('Session Inactivity Timeout')
    PASSWORD_CHANGE = 'PASSWORD_CHANGE', _('Password Changed')
    FORCE_TERMINATED = 'FORCE_TERMINATED', _('Force Terminated by Admin')
    SECURITY_LOCK = 'SECURITY_LOCK', _('Account Security Lockout')


class AuditAction(models.TextChoices):
    CREATE = 'CREATE', _('Record Created')
    UPDATE = 'UPDATE', _('Record Updated')
    DELETE = 'DELETE', _('Record Soft-Deleted')
    RESTORE = 'RESTORE', _('Record Restored')
    LOGIN_SUCCESS = 'LOGIN_SUCCESS', _('Successful Login')
    LOGIN_FAILED = 'LOGIN_FAILED', _('Failed Login Attempt')
    LOGOUT = 'LOGOUT', _('User Logout')
    PASSWORD_CHANGE = 'PASSWORD_CHANGE', _('Password Change')
    PASSWORD_RESET = 'PASSWORD_RESET', _('Password Reset')
    ACCOUNT_LOCK = 'ACCOUNT_LOCK', _('Account Locked')
    ACCOUNT_UNLOCK = 'ACCOUNT_UNLOCK', _('Account Unlocked')
    ROLE_CHANGE = 'ROLE_CHANGE', _('Role or Permissions Updated')
    TOUR_CREATE = 'TOUR_CREATE', _('Tour Created')
    TOUR_UPDATE = 'TOUR_UPDATE', _('Tour Updated')
    TOUR_DELETE = 'TOUR_DELETE', _('Tour Deleted')
    TOUR_IMAGE_UPLOAD = 'TOUR_IMAGE_UPLOAD', _('Tour Image Uploaded')
    TOUR_IMAGE_DELETE = 'TOUR_IMAGE_DELETE', _('Tour Image Deleted')
    TOUR_PRICE_CHANGE = 'TOUR_PRICE_CHANGE', _('Tour Price Changed')
    CONSULTATION_RESOLVED = 'CONSULTATION_RESOLVED', _('Consultation Resolved')
    CONSULTATION_UPDATE = 'CONSULTATION_UPDATE', _('Consultation Status Updated')
    STAFF_CREATE = 'STAFF_CREATE', _('Staff Account Created')
    STAFF_UPDATE = 'STAFF_UPDATE', _('Staff Profile Updated')
    STAFF_DELETE = 'STAFF_DELETE', _('Staff Deactivated')
