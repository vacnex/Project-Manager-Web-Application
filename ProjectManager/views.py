from ProjectManager.forms import LoginForm, RegistionForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate, decorators
from django.views import View
from ProjectManager.models import Course, Project, User
from django.urls import reverse
from django.contrib.auth.models import Group


# region index
def index(request):
    if request.user.is_superuser:
        return HttpResponseRedirect(reverse('admin:index'))
    else:
        return render(request, 'Pages/index.html')
# endregion

# region home
@decorators.login_required(login_url='/login')
def home(request):
    current_user = request.user.id
    cur_Project = Project.objects.filter(Users=current_user)
    course_list = dict()
    for p in cur_Project:
        course_list[p.courses.Course_ID] = {p.courses.Course_Name}
    context = {'course_list': course_list}
    return render(request, 'Pages/home.html', context)
# endregion

# region home_guest


def home_guest(request):
    return render(request, 'Pages/home_guest.html')
# endregion

# region loginUser


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
    context = {'form': form}
    return render(request, 'Pages/login.html', context)
# endregion

# region logout_view


def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')
# endregion

# region register


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
# endregion

# region CourseDetailView
class CourseDetailView(View):
    def get(self, request, courseid):
        current_user = request.user.id
        courses_list_by_user = Project.objects.filter(Users=current_user)
        project_list_by_course = Project.objects.filter(courses=courseid)
        all_courses_of_user = dict()
        Student_data = dict()
        Teacher_data = dict()
        for course in courses_list_by_user:
            all_courses_of_user[course.courses.Course_ID] = {course.courses.Course_Name}

        for course in courses_list_by_user:
            for p in project_list_by_course:
                if course.courses.Course_ID == p.courses.Course_ID:
                    Student_data[course.Project_Name] = [
                        pp.get_full_name() for pp in course.Users.all() if pp.is_Teacher is False]
        for course in courses_list_by_user:
            for p in project_list_by_course:
                if course.courses.Course_ID == p.courses.Course_ID:
                    Teacher_data[course.Project_Name] = [
                        pp.get_full_name() for pp in course.Users.all() if pp.is_Teacher]

        context = {'courseid': courseid, 'course_list': all_courses_of_user,'Student_data': Student_data, 'Teacher_data': Teacher_data}
        return render(request, 'Pages/course.html', context)
# endregion
