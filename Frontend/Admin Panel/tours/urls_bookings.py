from django.urls import path
from tours import views_bookings

app_name = 'bookings'

urlpatterns = [
    path('', views_bookings.booking_list_view, name='list'),
    path('<str:booking_id>/', views_bookings.booking_detail_view, name='detail'),
]
