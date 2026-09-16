from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    """
    Custom QuerySet supporting enterprise soft-delete patterns and filtered lookups.
    """
    def active(self):
        """Returns non-deleted active records."""
        return self.filter(is_deleted=False)

    def deleted(self):
        """Returns soft-deleted records."""
        return self.filter(is_deleted=True)

    def soft_delete(self, user=None):
        """Soft deletes all matching records in bulk."""
        return self.update(
            is_deleted=True,
            deleted_at=timezone.now(),
            deleted_by=user
        )

    def restore(self):
        """Restores soft-deleted records."""
        return self.update(
            is_deleted=False,
            deleted_at=None,
            deleted_by=None
        )


class StaffProfileQuerySet(SoftDeleteQuerySet):
    """
    Domain QuerySet for StaffProfile with specialized domain queries.
    """
    def locked(self):
        """Returns staff profiles currently locked out."""
        return self.active().filter(is_account_locked=True)

    def unlocked(self):
        """Returns active, non-locked staff profiles."""
        return self.active().filter(is_account_locked=False)

    def by_role(self, role):
        """Filters staff profiles by role."""
        return self.active().filter(role=role)

    def by_department(self, department):
        """Filters staff profiles by department."""
        return self.active().filter(department=department)


class StaffProfileManager(models.Manager):
    """
    Custom Manager for StaffProfile using StaffProfileQuerySet.
    Overrides default get_queryset to automatically filter out soft-deleted records.
    """
    def get_queryset(self):
        return StaffProfileQuerySet(self.model, using=self._db).active()

    def all_with_deleted(self):
        """Returns all records including soft-deleted ones."""
        return StaffProfileQuerySet(self.model, using=self._db)

    def deleted_only(self):
        """Returns soft-deleted records only."""
        return StaffProfileQuerySet(self.model, using=self._db).deleted()

    def locked(self):
        return self.get_queryset().locked()

    def unlocked(self):
        return self.get_queryset().unlocked()

    def by_role(self, role):
        return self.get_queryset().by_role(role)

    def by_department(self, department):
        return self.get_queryset().by_department(department)
