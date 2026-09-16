from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def root_redirect(request):
    return redirect('dashboard:index')

urlpatterns = [
    path('', root_redirect, name='root_redirect'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('tours/', include('tours.urls')),
    path('consultants/', include('consultants.urls')),
    path('booking/', include('booking.urls')),
    path('queries/', include('booking.urls_queries')),
    path('bookings/', include('tours.urls_bookings')), ]
