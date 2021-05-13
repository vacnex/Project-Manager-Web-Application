from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.loginUser, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('home/', views.home, name='home'),
    path('homeguest/', views.home_guest, name='home_guest'),
    path('course/<int:courseid>/', views.CourseDetailView.as_view(), name='course'),
    path('course/detail/',
         views.project_Details, name='projectdetails'),
]
