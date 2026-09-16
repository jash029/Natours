from django import forms

class ConsultantUpdateForm(forms.Form):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed / Scheduled'),
        ('completed', 'Completed'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    ]

    status = forms.ChoiceField(
        choices=STATUS_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label="Consultation Status"
    )
    internalNotes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 4,
            'placeholder': 'Add internal notes, follow-up comments, or resolution details...'
        }),
        label="Internal Staff Notes"
    )
