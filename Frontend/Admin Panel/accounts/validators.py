import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_phone_number(value):
    """
    Validates international phone numbers formatted in E.164 standard.
    Example: +14155552671
    """
    if not value:
        return
    phone_regex = re.compile(r'^\+?[1-9]\d{1,14}$')
    if not phone_regex.match(value):
        raise ValidationError(
            _('%(value)s is not a valid E.164 phone number. Format: +14155552671'),
            params={'value': value},
        )


def validate_employee_id(value):
    """
    Validates employee ID format (e.g., EMP-10001 or VNG-8821).
    """
    if not value:
        return
    emp_regex = re.compile(r'^[A-Z]{3,4}-\d{4,6}$')
    if not emp_regex.match(value):
        raise ValidationError(
            _('Employee ID must follow the prefix format like EMP-10001 or VNG-1001.'),
            params={'value': value},
        )
