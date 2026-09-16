from django.urls import path
from booking import views_queries

app_name = 'queries'

urlpatterns = [
    path('', views_queries.query_list_view, name='list'),
    path('<str:query_id>/', views_queries.query_detail_view, name='detail'),
]
