"""
Enterprise Django Forms for Accounts Application.
Form validation layers enforcing strict data integrity without leaking business logic.
"""

from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .constants import StaffRole, StaffDepartment
from .models import StaffProfile, Role
from .validators import validate_phone_number, validate_employee_id


def get_role_choices():
    """Returns dynamic role choices combining standard roles and DB roles."""
    choices = list(StaffRole.choices)
    existing_codes = set(c[0] for c in choices)
    try:
        for r in Role.objects.all():
            if r.code not in existing_codes:
                choices.append((r.code, r.name))
    except Exception:
        pass
    return choices


class StaffSignupForm(forms.Form):
    """Staff Self-Registration Form."""

    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': 'john_doe',
        }),
        label=_('Username')
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': 'john@natours.com',
        }),
        label=_('Work Email')
    )
    first_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': 'John',
        }),
        label=_('First Name')
    )
    last_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': 'Doe',
        }),
        label=_('Last Name')
    )
    role = forms.ChoiceField(
        choices=get_role_choices,
        widget=forms.Select(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
        }),
        label=_('Role / Position')
    )
    department = forms.ChoiceField(
        choices=StaffDepartment.choices,
        widget=forms.Select(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
        }),
        label=_('Department')
    )
    phone = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': '+1 (555) 000-0000',
        }),
        label=_('Phone Number')
    )
    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': '••••••••••••',
        }),
        label=_('Password')
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all',
            'placeholder': '••••••••••••',
        }),
        label=_('Confirm Password')
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError(_('Username is already taken.'))
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError(_('Email address is already in use.'))
        return email

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password')
        p2 = cleaned_data.get('confirm_password')
        if p1 and p2 and p1 != p2:
            raise ValidationError(_('Passwords do not match.'))
        return cleaned_data


class RoleForm(forms.ModelForm):
    """Form for Super Admins to create & edit custom Roles."""

    class Meta:
        model = Role
        fields = ['code', 'name', 'description']
        widgets = {
            'code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. EXPEDITION_LEAD'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Senior Expedition Lead'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Describe operational scope and duties...'}),
        }

    def clean_code(self):
        code = self.cleaned_data.get('code').upper().strip()
        if not self.instance.pk and Role.objects.filter(code=code).exists():
            raise ValidationError(_('A role with this code already exists.'))
        return code


class RoleSearchForm(forms.Form):
    """Search & Filter Form for Role Management."""

    q = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search role by name, code, or description...',
        })
    )



class LoginForm(forms.Form):
    """Secure Staff Login Form."""

    email_or_username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-control bg-slate-800 text-dark border-slate-700 placeholder-slate-400',
            'placeholder': 'admin@natours.com or username',
            'autocomplete': 'username',
        }),
        label=_('Email or Username'),
    )

    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control bg-slate-800 text-dark border-slate-700 placeholder-slate-400',
            'placeholder': '••••••••••••',
            'autocomplete': 'current-password',
        }),
        label=_('Password'),
    )

    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input bg-slate-800 border-slate-700',
        }),
        label=_('Remember me for 30 days'),
    )


class ForgotPasswordForm(forms.Form):
    """Password Reset Request Form."""

    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all',
            'placeholder': 'admin@natours.com',
        }),
        label=_('Registered Staff Email'),
    )


class ResetPasswordForm(forms.Form):
    """Password Reset Execution Form."""

    new_password = forms.CharField(
        min_length=10,
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500',
            'placeholder': 'New strong password (min 10 chars)',
        }),
        label=_('New Password'),
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500',
            'placeholder': 'Confirm new password',
        }),
        label=_('Confirm Password'),
    )

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('new_password')
        p2 = cleaned_data.get('confirm_password')
        if p1 and p2 and p1 != p2:
            raise ValidationError(_('Passwords do not match. Please re-enter.'))
        return cleaned_data


class ProfileUpdateForm(forms.ModelForm):
    """Form for staff members to update personal profile information."""

    first_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label=_('First Name')
    )
    last_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label=_('Last Name')
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
        label=_('Email Address (Read Only)'),
        required=False
    )

    class Meta:
        model = StaffProfile
        fields = ['phone', 'profile_image']
        widgets = {
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+14155552671'}),
            'profile_image': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://...'}),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if phone:
            validate_phone_number(phone)
        return phone


class ChangePasswordForm(forms.Form):
    """Form for authenticated staff to update their account password."""

    current_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label=_('Current Password')
    )
    new_password = forms.CharField(
        min_length=10,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label=_('New Password')
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label=_('Confirm New Password')
    )

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('new_password')
        p2 = cleaned_data.get('confirm_password')
        if p1 and p2 and p1 != p2:
            raise ValidationError(_('New passwords do not match.'))
        return cleaned_data


class StaffCreateForm(forms.Form):
    """Form used by Super Admins to provision new Staff Accounts."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].choices = get_role_choices()

    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label=_('Username')
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        label=_('Work Email')
    )
    first_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label=_('First Name')
    )
    last_name = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label=_('Last Name')
    )
    role = forms.ChoiceField(
        choices=get_role_choices,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label=_('Role')
    )
    department = forms.ChoiceField(
        choices=StaffDepartment.choices,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label=_('Department')
    )
    employee_id = forms.CharField(
        max_length=30,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Leave blank to auto-generate'}),
        label=_('Employee ID')
    )
    password = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label=_('Initial Password')
    )

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError(_('Username is already taken.'))
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError(_('Email address is already in use.'))
        return email

    def clean_employee_id(self):
        emp_id = self.cleaned_data.get('employee_id')
        if emp_id:
            validate_employee_id(emp_id)
            if StaffProfile.objects.all_with_deleted().filter(employee_id=emp_id).exists():
                raise ValidationError(_('Employee ID already exists.'))
        return emp_id


class StaffUpdateForm(forms.Form):
    """Form used to edit staff properties by administrators."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].choices = get_role_choices()

    first_name = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control'}))
    role = forms.ChoiceField(choices=get_role_choices, widget=forms.Select(attrs={'class': 'form-select'}))
    department = forms.ChoiceField(choices=StaffDepartment.choices, widget=forms.Select(attrs={'class': 'form-select'}))
    phone = forms.CharField(max_length=20, required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))


    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if phone:
            validate_phone_number(phone)
        return phone


class SearchForm(forms.Form):
    """Universal staff list search and filter form."""

    q = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search by name, email, employee ID...',
        })
    )
    role = forms.ChoiceField(
        choices=[('', 'All Roles')] + list(StaffRole.choices),
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    department = forms.ChoiceField(
        choices=[('', 'All Departments')] + list(StaffDepartment.choices),
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
