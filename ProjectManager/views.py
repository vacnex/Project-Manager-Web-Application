from ProjectManager.forms import LoginForm, RegistionForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate, decorators
from django.views import View
from ProjectManager.models import Course

# from django.contrib import messages


def index(request):
    return render(request, 'Pages/index.html')


@decorators.login_required(login_url='/login')
def home(request):
    courses = Course.objects.all()
    context = {'courses': courses}
    return render(request, 'Pages/home.html', context)


def home_guest(request):
    return render(request, 'Pages/home_guest.html')


def loginUser(request):
    if request.method == 'POST':
        form = LoginForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                next_url = request.POST.get('next')
                if next_url:
                    return HttpResponseRedirect(next_url)
                else:
                    return redirect('home')
    else:
        form = LoginForm()
    print("test", form)
    return render(request, 'Pages/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')


def register(request):
    if request.method == "POST":
        form = RegistionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = RegistionForm()
    # print(form)
    return render(request, 'Pages/register.html', {'form': form})


class CourseView(View):
    def get(self, request, courseid):
        CurrentCourseID = Course.objects.get(CourseID=courseid)
        CurrentCourseName = CurrentCourseID.CourseName
        Courses = Course.objects.all()
        context = {'courses': Courses, 'courseid': courseid,
                'CurrentCourseName': CurrentCourseName}
        return render(request, 'Pages/course.html', context)
