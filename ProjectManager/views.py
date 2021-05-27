from ProjectManager.forms import LoginForm, RegistionForm, ProjectRegistersForm, ConfirmProjectForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate, decorators
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from ProjectManager.models import Project, User
from django.urls import reverse
from django.http import JsonResponse


# region index
def index(request):
    if request.user.is_superuser:
        return HttpResponseRedirect(reverse('admin:index'))
    else:
        return render(request, 'Pages/index.html')
# endregion

# region home


@method_decorator(login_required(login_url='/login'), name='get')
class HomeIndex(View):
    def get(self, request):
        current_user = request.user.id
        cur_Project = Project.objects.filter(Users=current_user)
        Manager_project_list, student_project_data, Teacher_project_list, teacher = [], [], [], []
        request_pj, Is_Confirm = False, False
        register_form = None
        if request.user.is_superuser:
            return HttpResponseRedirect(reverse('admin:index'))
        if request.user.is_Manager:
            for mp in Project.objects.all():
                if not mp.Is_Confirm:
                    Manager_project_list.append(mp)
        elif request.user.is_Reviewer:
            pass
        elif request.user.is_Teacher:
            for project in cur_Project:
                Is_Confirm = True
                Teacher_project_list.append(project)
        else:
            if not len(cur_Project) > 0:
                request_pj = True
                register_form = ProjectRegistersForm()
            else:
                for project in cur_Project:
                    if project.Is_Confirm:
                        Is_Confirm = True
                        student_project_data.append(project.Project_ID)
                        student_project_data.append(project.Project_Name)
                        student_project_data.append(project.Project_Content)
        all_users = User.objects.all()
        for user in all_users:
            if user.is_Teacher:
                teacher.append(user)
        context = {'request_pj': request_pj,
                   'Is_Confirm': Is_Confirm, 'student_project_data': student_project_data, 'Manager_project_list': Manager_project_list, 'Teacher_project_list': Teacher_project_list, 'register_form': register_form, 'teacher': teacher, 'details': True}
        return render(request, 'Pages/home.html', context)

# region POST request
    def post(self, request):
        teacher_id, register_form = None, None
        teacher = User.objects.filter(
            username=request.POST.get('teacher', None))
        for t in teacher:
            teacher_id = t.id
        if request.method == "POST":
            register_form = ProjectRegistersForm(request.POST)
            if register_form.is_valid():
                obj = register_form.save()
                obj.Users.add(request.user)
                obj.Users.add(teacher_id)
                obj.save()
            else:
                print(register_form.errors)
        context = {'register_form': register_form}
        return render(request, 'Pages/home.html', context)
# endregion
# endregion

# region confirm
@method_decorator(login_required(login_url='/login'), name='get')
class ConfirmProject(View):
    def get(self, request, pk):
        confirm_form, Project_Name, Type, schoolYear, description, Is_Confirm = None, None, None, None, None, None
        teacher, username, fullname = [], [], []
        unconfirm_project_list_by_id = Project.objects.filter(
            Project_ID=pk)
        all_users = User.objects.all()
        for user in all_users:
            if user.is_Teacher:
                teacher.append(user)
        for p in unconfirm_project_list_by_id:
            Project_Name = p.Project_Name
            Type = p.Type
            schoolYear = p.schoolYear
            description = p.description
            Is_Confirm = p.Is_Confirm
            username = [u.username for u in p.Users.all()]
            fullname = [u for u in p.Users.all()]
        confirm_form = ConfirmProjectForm(initial={'Project_ID': pk, 'Project_Name': Project_Name,
                                                   'Type': Type, 'schoolYear': schoolYear, 'description': description, 'Is_Confirm': Is_Confirm})
        context = {'projectid': pk,
                   'unconfirm_project_list_by_id': unconfirm_project_list_by_id, 'teacher': teacher, 'confirm_form': confirm_form, 'student_username': username, 'fullname': fullname}
        return render(request, 'Pages/confirmproject.html', context)

    def post(self, request, pk):
        confirm_form, cur_student = None, None
        cur_Project = Project.objects.get(pk=pk)
        reviewer = User.objects.filter(
            username=request.POST.get('reviewer', None))
        teacher = User.objects.filter(
            username=request.POST.get('teacher', None))
        Is_Confirm = True if request.POST.get(
            'Is_Confirm', None) == "on" else False
        username_student = [
            p.username for p in cur_Project.Users.all() if not p.is_Teacher]
        cur_student = User.objects.filter(username=username_student[0])
        if request.method == "POST":
            data = {
                'Project_Name': cur_Project.Project_Name,
                'Type': cur_Project.Type,
                'schoolYear': cur_Project.schoolYear,
                'Users': teacher | reviewer | cur_student,
                'Is_Confirm': Is_Confirm
            }
            confirm_form = ConfirmProjectForm(
                data, instance=cur_Project)
            if confirm_form.is_valid():
                confirm_form.save()
                return redirect('home')
        else:
            confirm_form = ConfirmProjectForm()

        return render(request, 'Pages/confirmproject.html', {'confirm_form': confirm_form})
# endregion


@method_decorator(login_required(login_url='/login'), name='get')
class UpdateTask(View):
    def get(self, request, pk):
        cur_Project = Project.objects.filter(Project_ID=pk)
        null = False
        for p in cur_Project:
            if not p.Project_Content:
                null = True


        context = {'cur_Project': cur_Project, 'null': null, 'details': False,}
        return render(request, 'Pages/updatetask.html',context)

    def post(self, request, pk):
        print(request.POST.get('taskcontent', None))
        return render(request, 'Pages/updatetask.html')

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
            form.save()
            return redirect('index')
    else:
        form = RegistionForm()
    return render(request, 'Pages/register.html', {'form': form})
# endregion
