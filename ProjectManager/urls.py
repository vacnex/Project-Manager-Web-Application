from django.urls import path
from . import views

urlpatterns = [
    path('component', views.ComponentView.as_view(), name='component'),
    path('', views.index, name='index'),
    path('logout/', views.logout_view, name='logout'),
    path('home/', views.HomeIndex.as_view(), name='home'),
    path('assignment/', views.TeacherAssignment.as_view(), name='assignment'),
    path('projectdetail/<slug:pk>/',
         views.ProjectDetail.as_view(), name='ProjectDetail'),
]
