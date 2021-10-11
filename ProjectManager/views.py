from django.http import HttpResponse
from ProjectManager.forms import LoginForm, RegistionForm, AssignmentForm
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required, permission_required
from django.utils.decorators import method_decorator
from django.views import View
from ProjectManager.models import Project, User, Task
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
import json
from django.template.response import TemplateResponse
from django.core import serializers


class ComponentView(View):
    def get(self, request):
        return render(request, 'Pages/component.html')

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
                        if next_url:
                          if next_url == "/assignment/" and request.user.is_Manager:
                            return HttpResponseRedirect(next_url)
                          elif "projectdetail" in next_url and request.user.is_Teacher:
                            return HttpResponseRedirect(next_url)
                          else:
                            return redirect('home')
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
        student_project_data, Projects_list_of_Teacher = [], []
        Users_list_Manager = []
        Student_task = None
        # User = get_user_model()
        if request.user.is_superuser:
            return HttpResponseRedirect(reverse('admin:index'))
        if request.user.is_Manager:
            Users_list_Manager = User.objects.filter(is_Manager=False,is_superuser=False)
        elif request.user.is_Reviewer:
            pass
        elif request.user.is_Teacher:
            Projects_list_of_Teacher = cur_Project
        else:
          StudentProject = Project.objects.get(Users=request.user)
          
          if len(cur_Project) > 0:
            Student_task = Task.objects.filter(Project=Project.objects.get(
                Users=request.user))
            print("HomeView",Student_task)
              # "Bạn chưa được phân giáo viên hướng dẫn!! hãy liên lạc giáo viên quản lý để phân giáo viên."
                # register_form = ProjectRegistersForm()
            # else:
            #     for project in cur_Project:
            #         studenttask = project.Project_Content.replace(
            #             '<div class="deleteX"></div>', '')
            #         if project.Is_Confirm:
            #             Is_Confirm = True
            #             student_project_data.append(project.Project_ID)
            #             student_project_data.append(project.Project_Name)
            #             student_project_data.append(studenttask)
        context = {'Users_list_Manager': Users_list_Manager,
                   'Projects_list_of_Teacher': Projects_list_of_Teacher, 'Student_task': Student_task}
        return TemplateResponse(request, 'Pages/home.html', context)

#region POST request
    # def post(self, request):
    #     Is_Confirm, teacher_id, register_form = None, None, None
    #     student_project_data = []
    #     if request.POST.get('teacher', None) != None:
    #         teacher = User.objects.filter(
    #             username=request.POST.get('teacher', None))
    #         for t in teacher:
    #             teacher_id = t.id
    #         register_form = ProjectRegistersForm(request.POST)
    #         if register_form.is_valid():
    #             obj = register_form.save()
    #             obj.Users.add(request.user)
    #             obj.Users.add(teacher_id)
    #             obj.save()
    #         else:
    #             print(register_form.errors)
    #     elif request.POST.get('pjid', None) != None:
    #         cur_project = Project.objects.filter(
    #             Project_ID=request.POST.get('pjid', None))
    #         for project in cur_project:
    #             project.Project_Content = request.POST.get('taskcontent', None)
    #             project.save()
    #             Is_Confirm = True
    #             student_project_data.append(project.Project_ID)
    #             student_project_data.append(project.Project_Name)
    #             student_project_data.append(project.Project_Content)

    #     context = {'register_form': register_form, 'Is_Confirm': Is_Confirm,
    #                'student_project_data': student_project_data}
    #     return render(request, 'Pages/home.html', context)
# endregion
# endregion

# def HomeStudentGet(request):
#   if request.user.is_Manager:
#     return JsonResponse('Manager', safe=False)
#   elif request.user.is_Teacher:
#     return JsonResponse('Teacher', safe=False)
#   elif request.user.is_Reviewer:
#     return JsonResponse('Reviewer', safe=False)
#   else:
#     Student_task = Task.objects.filter(
#         Project=Project.objects.get(Users=request.user)).order_by('-createdTaskDate')[:1]
#     a = serializers.serialize('json', Student_task)
#     print(a)
#     # task = {
#     #   "id": Student_task.id,
#     #   "taskName": Student_task.taskName,
#     #   "taskDesc": Student_task.taskDesc,
#     #   "priority": Student_task.priority,
#     #   "deadline": Student_task.deadline,
#     #   "complete": Student_task.complete,
#     #   }
#     return JsonResponse(a, status=200, safe=False)

# region confirm
# @method_decorator(login_required(login_url='/login'), name='get')
# class ConfirmProject(View):
#     def get(self, request, pk):
#         confirm_form, Project_Name, Type, schoolYear, description, Is_Confirm = None, None, None, None, None, None
#         teacher, username, fullname = [], [], []
#         unconfirm_project_list_by_id = Project.objects.filter(
#             id=pk)
#         all_users = User.objects.all()
#         for user in all_users:
#             if user.is_Teacher:
#                 teacher.append(user)
#         for p in unconfirm_project_list_by_id:
#             Project_Name = p.Project_Name
#             Type = p.Type
#             schoolYear = p.schoolYear
#             description = p.description
#             Is_Confirm = p.Is_Confirm
#             username = [u.username for u in p.Users.all()]
#             fullname = [u for u in p.Users.all()]
#         confirm_form = ConfirmProjectForm(initial={'Project_ID': pk, 'Project_Name': Project_Name, 'Type': Type, 'schoolYear': schoolYear, 'description': description, 'Is_Confirm': Is_Confirm})
#         context = {'projectid': pk,
#                    'unconfirm_project_list_by_id': unconfirm_project_list_by_id, 'teacher': teacher, 'confirm_form': confirm_form, 'student_username': username, 'fullname': fullname}
#         return render(request, 'Pages/confirmproject.html', context)

#     def post(self, request, pk):
#         confirm_form, cur_student = None, None
#         cur_Project = Project.objects.get(pk=pk)
#         reviewer = User.objects.filter(
#             username=request.POST.get('reviewer', None))
#         teacher = User.objects.filter(
#             username=request.POST.get('teacher', None))
#         Is_Confirm = True if request.POST.get(
#             'Is_Confirm', None) == "on" else False
#         username_student = [
#             p.username for p in cur_Project.Users.all() if not p.is_Teacher]
#         cur_student = User.objects.filter(username=username_student[0])
#         if request.method == "POST":
#             data = {
#                 'Project_Name': cur_Project.Project_Name,
#                 'Type': cur_Project.Type,
#                 'schoolYear': cur_Project.schoolYear,
#                 'Users': teacher | reviewer | cur_student,
#                 'Is_Confirm': Is_Confirm
#             }
#             confirm_form = ConfirmProjectForm(
#                 data, instance=cur_Project)
#             if confirm_form.is_valid():
#                 confirm_form.save()
#                 return redirect('home')
#         else:
#             confirm_form = ConfirmProjectForm()

#         return render(request, 'Pages/confirmproject.html', {'confirm_form': confirm_form})
# endregion

# region ProjectDetail


@method_decorator(login_required(login_url='/login'), name='get')
class ProjectDetail(View):
    def get(self, request, pk):
        if not request.user.is_Teacher:
          raise PermissionDenied
        cur_Project = Project.objects.get(id=pk)
        Project_Name = cur_Project.Project_Name
        Project_Content = cur_Project.Project_Content
        parentTask = Task.objects.filter(Project=cur_Project, parentTask=None)
        if request.is_ajax:
          if request.method == 'GET' and 'action' in request.GET:
            if request.GET['action'] == 'get_child_task':
              parenttaskid = request.GET['parenttaskid']
              childTasks = Task.objects.filter(parentTask=parenttaskid)
              childTasks = serializers.serialize('json', childTasks)
              return JsonResponse(childTasks, status=200, safe=False)
            if request.GET['action'] == 'get_child_task_item':
              childTasksItem = Task.objects.filter(
                  parentTask=request.GET['parenttaskitemid'])
              childTasks = serializers.serialize('json', childTasksItem)
              # print(childTasksItem)
              return JsonResponse(childTasks, status=200, safe=False)
        context = {'pk': pk, 'Project_Name': Project_Name,
                   'Project_Content': Project_Content, 'parentTask': parentTask, }
        return render(request, 'Pages/projectdetail.html', context)

    def post(self, request, pk):
        if request.is_ajax:
            if request.POST['action'] == 'edit_pname':
                new_name = request.POST['new_name']
                t = Project.objects.get(id=pk)
                t.Project_Name = new_name
                t.save()
                if t.Project_Name == new_name:
                    print('doi ten thanh cong')
                    return JsonResponse({"message": 'success'})
            elif request.POST['action'] == 'add_task2':
              taskname = request.POST['taskname']
              t = Project.objects.get(id=pk)
              task = Task(taskName=taskname,
                          Project=Project.objects.get(id=pk))
              task.save()
              return JsonResponse({"message": 'addtask success'})
            elif request.POST['action'] == 'add_task':
                taskname = request.POST['taskname']
                taskdesc = request.POST['taskdesc']
                priority = request.POST['priority']
                deadline = request.POST['deadline']
                t = Project.objects.get(id=pk)
                task = Task(taskName=taskname,
                         taskDesc=taskdesc,
                         deadline=deadline,
                         priority=priority,
                         Project=Project.objects.get(id=pk))
                task.save()
                newtask = {
                    "pname": t.Project_Name,
                    "id": task.id,
                    "taskName": task.taskName,
                    "taskDesc": task.taskDesc,
                    "priority": task.priority,
                    "deadline": task.deadline,
                    "complete": task.complete,
                }
                return JsonResponse(json.dumps(newtask), status=200, safe=False)
            elif request.POST['action'] == 'del':
                tpk = request.POST['pk']
                p = Project.objects.get(id=pk)
                task = Task.objects.get(id=int(tpk))
                task.delete()
                deltakresponse={
                    'pname': p.Project_Name,
                    "message": 'success'
                }
                return JsonResponse(json.dumps(deltakresponse), status=200, safe=False)
            # elif request.POST['action'] == 'edit_task':
            #     pjid = request.POST['pjid']
            #     taskid = request.POST['taskid']
            #     taskname = request.POST['taskname']
            #     taskdesc = request.POST['taskdesc']
            #     taskprio = request.POST['taskprio']
            #     taskdeadline = request.POST['taskdeadline']
            #     cur_Project = Project.objects.get(id=pjid)
            #     task = Task.objects.get(id=taskid)
            #     task.taskName = taskname
            #     task.taskDesc = taskdesc
            #     task.priority = taskprio
            #     task.deadline = taskdeadline
            #     task.save()
            #     taskobj={
            #         'taskid': taskid,
            #         'taskname': taskname,
            #         'taskdesc': taskdesc,
            #         'taskprio': taskprio,
            #         'taskdeadline': taskdeadline,
            #         'message': 'Đã thêm công việc',
            #     }
            #     return JsonResponse(json.dumps(taskobj), status=200, safe=False)
            elif request.POST['action'] == 'add_child_task':
              p = Project.objects.get(id=pk)
              childtask = Task(taskName=request.POST['childtaskname'],
                          Project=Project.objects.get(id=pk))
              childtask.save()
              parentTask = Task.objects.get(id=request.POST['parenttaskid'])
              childtask.parentTask = parentTask
              childtask.save()
              childtaskobj={
                  'childtaskid': childtask.id,
                  'message': 'addchildtask success'
                }
              return JsonResponse(json.dumps(childtaskobj), status=200, safe=False)
            elif request.POST['action'] == 'add_child_task_item':
              childtask = Task(taskName=request.POST['childtaskitemname'],
                               Project=Project.objects.get(id=pk))
              childtask.save()
              parenttask = Task(id=request.POST['parenttaskid'])
              childtask.parentTask = parenttask
              childtask.save()
              return JsonResponse({"message": 'addchildtaskitem success'})
# endregion

# region TeacherAssignment


@method_decorator(login_required(login_url='/'), name='get')
class TeacherAssignment(View):
    # region get
    def get(self, request):
        if not request.user.is_Manager:
            raise PermissionDenied
        else:
            teacher, student, pjid = [], [], []
            projects = Project.objects.all()
            for user in User.objects.all():
                if user.is_Teacher:
                    teacher.append(user)
                elif not user.is_Teacher and not user.is_superuser and not user.is_Reviewer and not user.is_Manager:
                    student.append(user)

            context = {'teacher': teacher,
                       'student': student, 'projects': projects}
            return render(request, 'Pages/assignment.html', context)
    # endregion

    def post(self, request):
        if request.is_ajax:
            if request.POST['action'] == 'add':
                print('running add assignment')
                student = User.objects.filter(
                    id=request.POST.get('Student', None))
                teacher = User.objects.filter(
                    id=request.POST.get('Teacher', None))
                data = {
                    'Users': teacher | student,
                }
                assignment_form = AssignmentForm(data)
                if assignment_form.is_valid():
                    newrecord = assignment_form.save()
                    cur_Project = Project.objects.get(id=newrecord.id)
                    print(cur_Project.Users.all())
                    Users = cur_Project.Users.all()
                    for user in Users:
                        if user.is_Teacher:
                            tid = user.id
                            tname = user.get_full_name()
                        elif not user.is_Teacher and not user.is_superuser and not user.is_Reviewer and not user.is_Manager:
                            sid = user.id
                            sname = user.get_full_name()
                    newassignment={
                        "id": newrecord.id,
                        "tid": tid,
                        "sid": sid,
                        "tname": tname,
                        "sname": sname
                    }
                    return JsonResponse(json.dumps(newassignment), status=200, safe=False)
                else:
                    print(assignment_form.errors)
                    return JsonResponse({"error": assignment_form.errors}, status=400)
            elif request.POST['action'] == 'del':
                pk = request.POST['pk']
                assignment = Project.objects.get(id=int(pk))
                assignment.delete()
                return JsonResponse({"message": 'success'})
            elif request.POST['action'] == 'save_item':
                id = request.POST['id']
                cur_Assignment = Project.objects.get(id=id)
                student = User.objects.filter(
                    id=request.POST.get('Student', None))
                teacher = User.objects.filter(
                    id=request.POST.get('Teacher', None))
                pName = None
                if request.POST.get('pName', None) != 'Tên đề tài chưa cập nhật':
                    pName = request.POST.get('pName', None)
                data = {
                    'Project_Name': pName,
                    'Users': teacher | student,
                }
                confirmEdit_form = AssignmentForm(
                    data, instance=cur_Assignment)
                if confirmEdit_form.is_valid():
                    confirmEdit_form.save()
                    return JsonResponse({'message': 'save ajax success'}, status=200, safe=False)
                else:
                    return JsonResponse({'message': 'Save Fail'}, status=400, safe=False)
        return JsonResponse({"error": ""}, status=400)

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
