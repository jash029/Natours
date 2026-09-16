import os
from django import forms


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={'class': 'form-control', 'accept': 'image/*'}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


# ==============================================================================
# 1. BASIC TOUR INFORMATION FORM
# ==============================================================================
class BasicTourInformationForm(forms.Form):
    THEME_CHOICES = [
        ('Cities', 'Cities & Urban Exploration'),
        ('Mountains', 'Mountains & Alpine Trekking'),
        ('Oceans', 'Oceans & Coastal Yachting'),
        ('Forest', 'Forest & Wilderness Safari'),
        ('Culture', 'Culture & Imperial Heritage'),
    ]

    STATUS_CHOICES = [
        ('published', 'Published / Active'),
        ('draft', 'Draft / In Preparation'),
        ('archived', 'Archived / Inactive'),
    ]

    title = forms.CharField(
        label="Tour Expedition Title",
        max_length=120,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. American Rocky Mountain High Expedition', 'maxlength': '120'})
    )
    summary = forms.CharField(
        label="Short Teaser Summary",
        max_length=300,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Brief 1-sentence teaser summary (max 300 chars)', 'maxlength': '300'})
    )
    theme = forms.ChoiceField(
        label="Theme / Category",
        choices=THEME_CHOICES,
        required=True,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    destination = forms.CharField(
        label="City / Destination",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Denver'})
    )
    state = forms.CharField(
        label="State / Region",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Colorado'})
    )
    country = forms.CharField(
        label="Country",
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. USA'})
    )
    startLocation = forms.CharField(
        label="Starting Location / Pickup Point",
        required=True,
        initial="Flexible / Any Major City",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. New York'})
    )
    duration_days = forms.IntegerField(
        label="Duration (Days)",
        initial=7,
        min_value=1,
        required=True,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'min': 1})
    )
    startingPrice = forms.FloatField(
        label="Starting Price (USD $)",
        initial=3200,
        min_value=0,
        required=True,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '50', 'min': 0})
    )
    discount = forms.FloatField(
        label="Discount Amount (USD $)",
        initial=0,
        min_value=0,
        required=False,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '10', 'min': 0})
    )
    advanceBookingAmount = forms.FloatField(
        label="Advance Deposit Token (USD $)",
        initial=2000,
        min_value=0,
        required=True,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '100', 'min': 0}),
        help_text="Token amount collected online to confirm booking"
    )
    status = forms.ChoiceField(
        label="Status",
        choices=STATUS_CHOICES,
        initial='published',
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    featured = forms.BooleanField(
        label="Highlight as Featured Expedition",
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )
    trending = forms.BooleanField(
        label="Highlight as Trending Expedition",
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )

    def clean_title(self):
        title = (self.cleaned_data.get('title') or '').strip()
        if not title:
            raise forms.ValidationError("Tour name is required.")
        if len(title) > 120:
            raise forms.ValidationError("Tour name cannot exceed 120 characters.")
        return title

    def clean_summary(self):
        summary = (self.cleaned_data.get('summary') or '').strip()
        if not summary:
            raise forms.ValidationError("Tour summary is required.")
        if len(summary) > 300:
            raise forms.ValidationError("Tour summary cannot exceed 300 characters.")
        return summary

    def clean_destination(self):
        dest = (self.cleaned_data.get('destination') or '').strip()
        if not dest:
            raise forms.ValidationError("City / Destination is required.")
        return dest

    def clean_country(self):
        country = (self.cleaned_data.get('country') or '').strip()
        if not country:
            raise forms.ValidationError("Country is required.")
        return country

    def clean(self):
        cleaned_data = super().clean()

        starting_price = cleaned_data.get('startingPrice')
        if starting_price is None or starting_price < 0:
            starting_price = 0.0
            cleaned_data['startingPrice'] = 0.0

        discount = cleaned_data.get('discount')
        if discount is None or discount < 0:
            discount = 0.0
            cleaned_data['discount'] = 0.0

        if discount > starting_price:
            self.add_error('discount', f"Discount price (${discount:,.2f}) must not exceed starting price (${starting_price:,.2f}).")

        advance_amt = cleaned_data.get('advanceBookingAmount')
        if advance_amt is None or advance_amt < 0:
            advance_amt = 0.0
            cleaned_data['advanceBookingAmount'] = 0.0

        duration_days = cleaned_data.get('duration_days')
        if duration_days is None or duration_days < 1:
            cleaned_data['duration_days'] = 1

        return cleaned_data


# ==============================================================================
# 2. TOUR MEDIA FORM
# ==============================================================================
class TourMediaForm(forms.Form):
    cover_image = forms.ImageField(
        label="Replace / Upload Cover Image",
        widget=forms.FileInput(attrs={'class': 'form-control', 'accept': 'image/*'}),
        required=False
    )
    delete_cover = forms.BooleanField(
        label="Delete current cover image",
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )
    new_gallery_images = MultipleFileField(
        label="Add New Gallery Images",
        required=False
    )
    remove_gallery_images = forms.CharField(
        widget=forms.HiddenInput(),
        required=False
    )

    def clean_cover_image(self):
        return self.cleaned_data.get('cover_image')

    def clean_new_gallery_images(self):
        files = self.cleaned_data.get('new_gallery_images')
        if files and isinstance(files, (list, tuple)) and len(files) > 5:
            raise forms.ValidationError("Maximum 5 gallery images are allowed.")
        return files

    def clean_remove_gallery_images(self):
        val = self.cleaned_data.get('remove_gallery_images', '')
        return val.strip() if val else ''


# ==============================================================================
# 3. TOUR CONTENT FORM
# ==============================================================================
class TourContentForm(forms.Form):
    description = forms.CharField(
        label="Full Tour Description",
        required=True,
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'placeholder': 'Embark on an extraordinary expedition...'})
    )
    itinerary_text = forms.CharField(
        label="Day-by-Day Itinerary (Format: Day 1: Title | Details)",
        required=True,
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Day 1: Arrival in Denver | Check in at hotel...\nDay 2: Cultural Tour | Walking tour...'})
    )

    def clean_description(self):
        desc = (self.cleaned_data.get('description') or '').strip()
        if not desc:
            raise forms.ValidationError("Tour description is required.")
        return desc

    def clean_itinerary_text(self):
        return (self.cleaned_data.get('itinerary_text') or '').strip()


# ==============================================================================
# 4. TOUR PACKAGE FORM
# ==============================================================================
class TourPackageForm(forms.Form):
    PACKAGE_TYPE_CHOICES = [
        ('Normal', 'Normal Package'),
        ('Standard', 'Standard Package'),
        ('Premium', 'Premium Package'),
    ]

    package_name = forms.ChoiceField(
        label="Primary Package Tier",
        choices=PACKAGE_TYPE_CHOICES,
        required=False,
        initial="Normal",
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    hotel_rating = forms.IntegerField(
        label="Hotel / Lodging Star Rating",
        required=False,
        initial=4,
        min_value=1,
        max_value=5,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 5})
    )
    meals_included = forms.CharField(
        label="Included Meals Plan",
        required=False,
        initial="Breakfast",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Breakfast, Dinner'})
    )
    transport_type = forms.CharField(
        label="Transportation Mode",
        required=False,
        initial="Shared Bus",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. Private Coach / Luxury SUV'})
    )
    extra_facilities = forms.CharField(
        label="Extra Facilities & Amenities",
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'e.g. National Park Entry, Airport Transfers'})
    )

    def clean_hotel_rating(self):
        val = self.cleaned_data.get('hotel_rating')
        if val is None or val < 1 or val > 5:
            return 4
        return val


# ==============================================================================
# 5. TOUR ADVANCED SETTINGS FORM
# ==============================================================================
class TourAdvancedSettingsForm(forms.Form):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy - Suitable for All Ages'),
        ('Moderate', 'Moderate - Reasonable Fitness Required'),
        ('Challenging', 'Challenging - High Altitude / Trekking'),
        ('Extreme', 'Extreme - Professional Mountaineering'),
    ]

    max_group_size = forms.IntegerField(
        label="Maximum Group Capacity",
        required=False,
        initial=15,
        min_value=1,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'min': 1})
    )
    difficulty_level = forms.ChoiceField(
        label="Tour Difficulty Level",
        required=False,
        choices=DIFFICULTY_CHOICES,
        initial='Moderate',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    meta_title = forms.CharField(
        label="SEO Meta Title",
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. American Rocky Mountain High Expedition | Natours'})
    )
    meta_keywords = forms.CharField(
        label="SEO Keywords",
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g. USA Tour, Mountains Tour, Denver Travel'})
    )

    def clean_max_group_size(self):
        val = self.cleaned_data.get('max_group_size')
        if val is None or val < 1:
            return 15
        return val


# Legacy wrapper for backwards compatibility
class TourForm(forms.Form):
    pass


