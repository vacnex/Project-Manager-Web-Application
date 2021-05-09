from ProjectManager.forms import LoginForm, RegistionForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate, decorators
from django.views import View
from ProjectManager.models import Course, Project, User
from django.urls import reverse
from django.contrib.auth.models import Group
# from django.contrib import messages


def index(request):
    if request.user.is_superuser:
        return HttpResponseRedirect(reverse('admin:index'))
    else:
        return render(request, 'Pages/index.html')


@decorators.login_required(login_url='/login')
def home(request):
    current_user = request.user
    Project_Home_View = Project.objects.filter(Users=current_user)
    # print(user_in_project)
    # for c in courses:
    #     print(c.courses.Course_Name)
    context = {'Project': Project_Home_View}
    return render(request, 'Pages/home.html', context)


def home_guest(request):
    return render(request, 'Pages/home_guest.html')


def loginUser(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        if request.method == 'POST':
            form = LoginForm(request=request, data=request.POST)
            if form.is_valid():
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                user = authenticate(username=username, password=password)
                if user is not None:
                    login(request, user)
                    next_url = request.POST.get('next')
                    if request.user.is_superuser:
                        return HttpResponseRedirect(reverse('admin:index'))
                    else:
                        if next_url:
                            return HttpResponseRedirect(next_url)
                        else:
                            return redirect('home')
        else:
            form = LoginForm()
    return render(request, 'Pages/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')


def register(request):
    if request.method == "POST":
        form = RegistionForm(request.POST)
        if form.is_valid():
            user = form.save()
            group = Group.objects.get(name='Student')
            user.groups.add(group)
            return redirect('index')
    else:
        form = RegistionForm()
    return render(request, 'Pages/register.html', {'form': form})


class CourseView(View):
    def get(self, request, courseid):
        CurrentCourseID = Course.objects.get(Course_ID=courseid)
        CurrentCourseName = CurrentCourseID.Course_Name
        current_user = request.user
        Project_Courses_view = Project.objects.filter(Users=current_user)
        Project_contents = Project.objects.filter(courses=CurrentCourseID)
        Project_content = Project_contents[0].Project_Content
        context = {'Project': Project_Courses_view, 'courseid': courseid,
                   'CurrentCourseName': CurrentCourseName, 'Project_content': Project_content}
        return render(request, 'Pages/course.html', context)
