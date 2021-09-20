from ProjectManager.forms import LoginForm, RegistionForm, ProjectRegistersForm, ConfirmProjectForm, TeacherAssignmentForm
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate, decorators
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from ProjectManager.models import Project, User, TeacherAssignment as TA
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.http import JsonResponse


# region index
def index(request):
    if request.user.is_superuser:
        return HttpResponseRedirect(reverse('admin:index'))
    else:
        logged = False
        if request.user.is_authenticated:
            logged = True
            context = {'logged': logged}
            return render(request, 'Pages/index.html', context)
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
        return render(request, 'Pages/index.html', context)
# endregion

# region home


@method_decorator(login_required(login_url='/'), name='get')
class HomeIndex(View):
    def get(self, request):
        current_user = request.user.id
        cur_Project = Project.objects.filter(Users=current_user)
        Manager_project_list, student_project_data, Teacher_project_list, teacher = [], [], [], []
        list_teacher_user, list_student_user = [], []
        request_pj, Is_Confirm = False, False
        register_form = None
        if request.user.is_superuser:
            return HttpResponseRedirect(reverse('admin:index'))
        if request.user.is_Manager:
            User = get_user_model()
            for user in User.objects.all():
                if user.is_Teacher:
                    list_teacher_user.append(user)
                if not user.is_Teacher and not user.is_Manager and not user.is_Reviewer and not user.is_superuser:
                    list_student_user.append(user)
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
                    studenttask = project.Project_Content.replace(
                        '<div class="deleteX"></div>', '')
                    if project.Is_Confirm:
                        Is_Confirm = True
                        student_project_data.append(project.Project_ID)
                        student_project_data.append(project.Project_Name)
                        student_project_data.append(studenttask)
        all_users = User.objects.all()
        for user in all_users:
            if user.is_Teacher:
                teacher.append(user)
        context = {'request_pj': request_pj,
                   'Is_Confirm': Is_Confirm, 'student_project_data': student_project_data, 'Manager_project_list': Manager_project_list, 'Teacher_project_list': Teacher_project_list, 'register_form': register_form, 'teacher': teacher, 'details': True, 'list_student_user': list_student_user, 'list_teacher_user': list_teacher_user}
        return render(request, 'Pages/home.html', context)

# region POST request
    def post(self, request):
        Is_Confirm, teacher_id, register_form = None, None, None
        student_project_data = []
        if request.POST.get('teacher', None) != None:
            teacher = User.objects.filter(
                username=request.POST.get('teacher', None))
            for t in teacher:
                teacher_id = t.id
            register_form = ProjectRegistersForm(request.POST)
            if register_form.is_valid():
                obj = register_form.save()
                obj.Users.add(request.user)
                obj.Users.add(teacher_id)
                obj.save()
            else:
                print(register_form.errors)
        elif request.POST.get('pjid', None) != None:
            cur_project = Project.objects.filter(
                Project_ID=request.POST.get('pjid', None))
            for project in cur_project:
                project.Project_Content = request.POST.get('taskcontent', None)
                project.save()
                Is_Confirm = True
                student_project_data.append(project.Project_ID)
                student_project_data.append(project.Project_Name)
                student_project_data.append(project.Project_Content)

        context = {'register_form': register_form, 'Is_Confirm': Is_Confirm,
                   'student_project_data': student_project_data}
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

# region


@method_decorator(login_required(login_url='/login'), name='get')
class UpdateTask(View):
    def get(self, request, pk):
        cur_Project = Project.objects.filter(Project_ID=pk)
        null = False
        for p in cur_Project:
            if not p.Project_Content:
                null = True

        context = {'cur_Project': cur_Project,
                   'null': null, 'details': False, 'pk': pk}
        return render(request, 'Pages/updatetask.html', context)

    def post(self, request, pk):
        cur_project = Project.objects.filter(Project_ID=pk)
        for project in cur_project:
            project.Project_Content = request.POST.get('taskcontent', None)
            project.save()
        null = False
        for p in cur_project:
            if not p.Project_Content:
                null = True
        context = {'cur_Project': cur_project, 'null': null, 'pk': pk}
        return render(request, 'Pages/updatetask.html', context)
# endregion

# region TeacherAssignment


@method_decorator(login_required(login_url='/'), name='get')
class TeacherAssignment(View):
    # region get
    def get(self, request):
        assignment_form = None
        ta_dict = {}
        tName, sName, pName = "", "", ""
        list_teacher_assignment = []
        for a in TA.objects.all():
            for user in User.objects.all():
                if a.Teacher_id == user.id:
                    tName = user.get_full_name()
                if a.Student_id == user.id:
                    sName = user.get_full_name()
            for p in Project.objects.all():
                if a.Project_id == p.Project_ID:
                    pName = p.Project_Name
                else:
                    pName = ""
            ta_dict = {"id": a.id, "Teacher": tName,
                       "Student": sName, "ProjectName": pName}
            ta_dict_copy = ta_dict.copy()
            list_teacher_assignment.append(ta_dict_copy)
        assignment_form = TeacherAssignmentForm()
        context = {'list_teacher_assignment': list_teacher_assignment,
                   'assignment_form': assignment_form}
        return render(request, 'Pages/assignment.html', context)
# endregion

    def post(self, request):
        student = User.objects.get(id=request.POST.get('Student'))
        teacher = User.objects.get(id=request.POST.get('Teacher'))
        data = {
            'Teacher': teacher,
            'Student': student,
        }
        assignment_form = TeacherAssignmentForm(data)
        # assignment_form = TeacherAssignmentForm(request.POST)
        if assignment_form.is_valid():
            assignment_form.save()
            return HttpResponseRedirect('/assignment/')
        else:
            print(assignment_form.errors)

        return render(request, 'Pages/assignment.html', {'assignment_form': assignment_form})

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
