from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login,name='login'),
    path('register/', views.register, name='register'),
    path('home/', views.home, name='home'),
    path('homeguest/', views.home_guest, name='home_guest'),
]
