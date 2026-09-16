from django.urls import path
from tours import views

app_name = 'tours'

urlpatterns = [
    path('', views.tour_list_view, name='list'),
    path('add/', views.tour_create_view, name='add'),
    path('<str:tour_id>/', views.tour_detail_view, name='detail'),
    path('<str:tour_id>/edit/', views.tour_edit_view, name='edit'),
    path('<str:tour_id>/delete/', views.tour_delete_view, name='delete'),
    path('<str:tour_id>/status/', views.tour_status_toggle_view, name='status_toggle'),

    # JSON API Endpoints
    path('api/v1/tours/', views.api_tours_list, name='api_tours_list'),
    path('api/v1/tours/<str:tour_id>/', views.api_tour_detail, name='api_tour_detail'),
]
