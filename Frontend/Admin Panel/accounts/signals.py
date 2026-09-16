"""
Django Signals for Accounts Application.
Automatically maintains StaffProfile creation upon User creation.
"""

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .constants import StaffRole, StaffDepartment
from .models import StaffProfile


@receiver(post_save, sender=User)
def create_or_update_staff_profile(sender, instance, created, **kwargs):
    """
    Ensures every Django User has a corresponding StaffProfile instance.
    """
    if created:
        role = StaffRole.SUPER_ADMIN if instance.is_superuser else StaffRole.SUPER_ADMIN
        dept = StaffDepartment.EXECUTIVE if instance.is_superuser else StaffDepartment.OPERATIONS
        StaffProfile.objects.get_or_create(
            user=instance,
            defaults={
                'role': role,
                'department': dept,
            }
        )
    else:
        if hasattr(instance, 'staff_profile'):
            instance.staff_profile.save()
