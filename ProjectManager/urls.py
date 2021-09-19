from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
#     path('login/', views.loginUser, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('home/', views.HomeIndex.as_view(), name='home'),
    path('assignment/', views.TeacherAssignment.as_view(), name='assignment'),
    path('confirm/<slug:pk>/',
         views.ConfirmProject.as_view(), name='ConfirmProject'),
    path('updatetask/<slug:pk>/',
         views.UpdateTask.as_view(), name='UpdateTask'),
    # path('course/<int:courseid>/', views.CourseDetailView.as_view(), name='course'),
    # path('course/detail/',
    #      views.project_Details, name='projectdetails'),
]
