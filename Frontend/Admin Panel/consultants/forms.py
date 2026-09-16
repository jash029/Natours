from django import forms

class ConsultantUpdateForm(forms.Form):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed / Scheduled'),
        ('completed', 'Completed'),
    ]

    status = forms.ChoiceField(
        choices=STATUS_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label="Consultation Status",
        initial="pending"
    )
    internalNotes = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 4,
            'placeholder': 'Give User a Message and Link for the Meeting'
        }),
        label="Internal Staff Notes"

    )
