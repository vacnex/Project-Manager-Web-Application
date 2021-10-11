from django.urls import path
from . import views

urlpatterns = [
    path('component', views.ComponentView.as_view(), name='component'),
    path('', views.index, name='index'),
#     path('login/', views.loginUser, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('home/', views.HomeIndex.as_view(), name='home'),
    # path('api/updatetask/', views.HomeStudentGet, name='updatetask'),
    path('assignment/', views.TeacherAssignment.as_view(), name='assignment'),
    # path('confirm/<slug:pk>/',
    #      views.ConfirmProject.as_view(), name='ConfirmProject'),
    path('projectdetail/<slug:pk>/',
         views.ProjectDetail.as_view(), name='ProjectDetail'),
    # path('course/<int:courseid>/', views.CourseDetailView.as_view(), name='course'),
    # path('course/detail/',
    #      views.project_Details, name='projectdetails'),
]
