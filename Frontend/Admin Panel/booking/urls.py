from django.urls import path
from booking import views

app_name = 'consultants'

urlpatterns = [
    path('', views.consultant_list_view, name='list'),
    path('<str:consultant_id>/', views.consultant_detail_view, name='detail'),
]
