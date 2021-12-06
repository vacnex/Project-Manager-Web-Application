from django.http import HttpResponse
from ProjectManager.forms import LoginForm, RegistionForm, AssignmentForm
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required, permission_required
from django.utils.decorators import method_decorator
from django.views import View
from ProjectManager.models import Project, User, Task, SchoolYear
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
import json
from itertools import chain
from django.core.exceptions import ObjectDoesNotExist
from django.template.response import TemplateResponse
from django.core import serializers


class ComponentView(View):
  def get(self, request):
    return render(request, 'Pages/component.html')

# region index


class index(View):
  def get(self, request):
    logged = False
    form = LoginForm()
    if request.user.is_superuser:
      return HttpResponseRedirect(reverse('admin:index'))
    if request.user.is_authenticated:
      logged = True
      context = {'logged': logged}
      return render(request, 'Pages/index.html', context)
    return render(request, 'Pages/index.html')

  def post(self, request):
    form = LoginForm(request=request, data=request.POST)
    print(request.is_ajax())
    if request.is_ajax():
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
            if "assignment" in next_url and request.user.is_Manager:
              return JsonResponse({"Redirect": next_url}, status=200)
            elif "projectdetail" in next_url and request.user.is_Teacher:
              return JsonResponse({"Redirect": next_url}, status=200)
            else:
              return JsonResponse({"Redirect": '/home'}, status=200)
          else:
            return JsonResponse({"Redirect": 'index'}, status=200)
    return JsonResponse({"error": form.errors}, status=401)

# def index(request):
#     if request.user.is_superuser:
#         return HttpResponseRedirect(reverse('admin:index'))
#     else:
#         logged = False
#         if request.user.is_authenticated:
#             logged = True
#             context = {'logged': logged}
#             return render(request, 'Pages/index.html', context)
#         else:
#             if request.method == 'POST':
#                 form = LoginForm(request=request, data=request.POST)
#                 if form.is_valid():
#                     username = form.cleaned_data['username']
#                     password = form.cleaned_data['password']
#                     user = authenticate(username=username, password=password)
#                     if user is not None:
#                         login(request, user)
#                         next_url = request.POST.get('next')
#                         if request.user.is_superuser:
#                             return HttpResponseRedirect(reverse('admin:index'))
#                         if next_url:
#                             if next_url == "/assignment/" and request.user.is_Manager:
#                                 return HttpResponseRedirect(next_url)
#                             elif "projectdetail" in next_url and request.user.is_Teacher:
#                                 return HttpResponseRedirect(next_url)
#                             else:
#                                 return redirect('home')
#                         else:
#                             return redirect('home')
#                 else:
#                   print (form.errors)
#             else:
#               form = LoginForm()
#             context = {'form': form}
#             return render(request, 'Pages/index.html', context)
# endregion

# region home


@method_decorator(login_required(login_url='/'), name='get')
class HomeIndex(View):
  def get(self, request):
    current_user = request.user.id
    cur_Project = Project.objects.filter(Users=current_user)
    student_project_data, Projects_list_of_Teacher = [], []
    Users_list_Manager = []
    Student_task, StudentProject = None, None
    # User = get_user_model()
    if request.user.is_superuser:
      return HttpResponseRedirect(reverse('admin:index'))
    if request.user.is_Manager:
      Users_list_Manager = User.objects.filter(
          is_Manager=False, is_superuser=False)
    elif request.user.is_Reviewer:
      pass
    elif request.user.is_Teacher:
      Projects_list_of_Teacher = cur_Project
    else:
      try:
        StudentProject = Project.objects.get(Users=request.user)
        Student_task = Task.objects.filter(Project=StudentProject)
      except ObjectDoesNotExist:
        StudentProject = None
    context = {'Users_list_Manager': Users_list_Manager,
               'Projects_list_of_Teacher': Projects_list_of_Teacher, 'Student_task': Student_task, 'StudentProject': StudentProject}
    return TemplateResponse(request, 'Pages/home.html', context)

  def post(self, request):
    if request.POST['action'] == 'GET_CHILD_TASK':
      tasks = Task.objects.filter(parentTask=request.POST['parentTaskId'])
      return JsonResponse(serializers.serialize('json', tasks), status=200, safe=False)
    elif request.POST['action'] == 'GET_CHILD_TASK_ITEM':
      tasks = Task.objects.filter(parentTask=request.POST['childTaskId'])
      return JsonResponse(serializers.serialize('json', tasks), status=200, safe=False)
    elif request.POST['action'] == 'COMPLETE_TASK':
      task = Task.objects.get(id=request.POST['taskID'])
      taskState = json.loads(request.POST['taskState'])
      task.tempComplete = taskState
      task.save()
      return JsonResponse(json.dumps({"message": 'Update task state successfully'}), status=200, safe=False)

# endregion


# region ProjectDetail


@method_decorator(login_required(login_url='/'), name='get')
class ProjectDetail(View):
  def get(self, request, pk):
    if not request.user.is_Teacher:
      raise PermissionDenied
    cur_Project = Project.objects.get(id=pk)
    Project_Name = cur_Project.Project_Name
    mainTasks = Task.objects.filter(Project=cur_Project, parentTask=None)
    if request.is_ajax:
      if request.method == 'GET' and 'action' in request.GET:
        if request.GET['action'] == 'GET_SUB_TASK_DATA':
          parenttaskid = request.GET['parenttaskid']
          childTasks = Task.objects.filter(parentTask=parenttaskid)
          childTasks = serializers.serialize('json', childTasks)
          return JsonResponse(childTasks, status=200, safe=False)
        if request.GET['action'] == 'GET_SUB_TASK_ITEM_DATA':
          childTasksItem = Task.objects.filter(
              parentTask=request.GET['parenttaskitemid'])
          childTasks = serializers.serialize('json', childTasksItem)
          return JsonResponse(childTasks, status=200, safe=False)
    context = {'pk': pk, 'Project_Name': Project_Name,
               'ProjectView': True, 'mainTasks': mainTasks, }
    return render(request, 'Pages/projectdetail.html', context)

  def post(self, request, pk):
    if request.is_ajax:
      # region Sửa tên project
      if request.POST['action'] == 'EDIT_PROJECT_NAME':
        newPName = request.POST['newPName']
        if not newPName:
          newPName = None
        t = Project.objects.get(id=pk)
        t.Project_Name = newPName
        t.save()
        if t.Project_Name == newPName:
          RenameObj = {
              'message': 'Đã đổi tên đồ án'
          }
          return JsonResponse(json.dumps(RenameObj), status=200, safe=False)
      # endregion
      # region thêm hoặc sửa tên task chính
      elif request.POST['action'] == 'ADD_OR_EDIT_MAIN_TASK_NAME':
        p = Project.objects.get(id=pk)
        if request.POST['mainTaskId'] == 'null' and request.POST['mainTaskName']:
          task = Task(
              taskName=request.POST['mainTaskName'], Project=p, fileEnabled=1)
          task.save()
          taskObj = {
              'mainTaskId': task.id,
              'Created': True,
              'message': 'Đã cập nhật tên task chính'
          }
          return JsonResponse(json.dumps(taskObj), status=200, safe=False)
        if request.POST['mainTaskId'] and request.POST['mainTaskName']:
          task = Task.objects.get(id=request.POST['mainTaskId'])
          task.taskName = request.POST['mainTaskName']
          task.save()
          taskObj = {
              'Created': False,
              'message': 'Đã chỉnh sửa tên task chính'
          }
          return JsonResponse(json.dumps(taskObj), status=200, safe=False)
      # endregion
      # region thêm hoặc sửa subtask
      elif request.POST['action'] == 'ADD_OR_EDIT_SUB_TASK':
        p = Project.objects.get(id=pk)
        if request.POST['mainTaskId'] and request.POST['subTaskId'] == 'null' and request.POST['subTaskName'] != None:
          subTask = Task(
              taskName=request.POST['subTaskName'], Project=p)
          subTask.save()
          parentTask = Task.objects.get(
              id=request.POST['mainTaskId'])
          subTask.parentTask = parentTask
          subTask.save()
          subTaskObject = {
              'subTaskId': subTask.id,
              'Created': True,
              'message': 'Đã thêm công việc phụ'
          }
          return JsonResponse(json.dumps(subTaskObject), status=200, safe=False)
        if request.POST['mainTaskId'] and request.POST['subTaskId'] and request.POST['subTaskName']:
            # request.POST['childTaskName'] == '' or
          subTaskId = request.POST['subTaskId']
          subTask = Task.objects.get(id=subTaskId)
          # if request.POST['childTaskName'] == '':
          #   task.delete()
          # else:
          subTask.taskName = request.POST['subTaskName']
          subTask.save()
          subTaskObject = {
              'Created': False,
              'message': 'Đã chỉnh sửa công việc phụ'
          }
          return JsonResponse(json.dumps(subTaskObject), status=200, safe=False)
      # endregion
      # region thêm hoặc sửa task child item
      elif request.POST['action'] == 'ADD_OR_EDIT_SUB_TASK_ITEM':
        p = Project.objects.get(id=pk)
        if request.POST['subTaskId'] and request.POST['subTaskItemId'] == 'null' and request.POST['subTaskItemName']:
          subTaskItem = Task(
              taskName=request.POST['subTaskItemName'], Project=p)
          subTaskItem.save()
          parentTask = Task.objects.get(
              id=request.POST['subTaskId'])
          subTaskItem.parentTask = parentTask
          subTaskItem.save()
          subTaskItemObj = {
              'subTaskItemId': subTaskItem.id,
              'message': 'Đã thêm '+request.POST['subTaskItemName']
          }
          return JsonResponse(json.dumps(subTaskItemObj), status=200, safe=False)
        if request.POST['subTaskId'] == 'null' and request.POST['subTaskItemId'] and request.POST['subTaskItemName']:
          subTaskItemId = request.POST['subTaskItemId']
          subTaskItemName = request.POST['subTaskItemName']
          task = Task.objects.get(id=subTaskItemId)
          task.taskName = subTaskItemName
          task.save()
          subTaskItemObj = {
              'message': 'Đã lưu chỉnh sửa '+subTaskItemName
          }
          return JsonResponse(json.dumps(subTaskItemObj), status=200, safe=False)
      # endregion
      # region sửa mô tả task chính
      elif request.POST['action'] == 'EDIT_MAIN_TASK_DESC':
        mainTaskId = request.POST['mainTaskId']
        mainTaskDesc = request.POST['mainTaskDesc']
        if mainTaskDesc == "null":
          mainTaskDesc = None
        task = Task.objects.get(id=mainTaskId)
        task.taskDesc = mainTaskDesc
        task.save()
        taskDescObj = {
            'message': 'Đã lưu mô tả'
        }
        return JsonResponse(json.dumps(taskDescObj), status=200, safe=False)
   # endregion
      # region sửa ưu tiên task chính
      elif request.POST['action'] == 'EDIT_MAIN_TASK_PRIO':
        mainTaskId = request.POST['mainTaskId']
        mainTaskPriority = request.POST['mainTaskPriority']
        task = Task.objects.get(id=mainTaskId)
        task.priority = mainTaskPriority
        task.save()
        taskPrioObj = {
            'message': 'Đã lưu thay đổi mức'
        }
        return JsonResponse(json.dumps(taskPrioObj), status=200, safe=False)
      # endregion
      # region sửa thời hạn task chính
      elif request.POST['action'] == 'EDIT_MAIN_TASK_DEADLINE':
        mainTaskId = request.POST['mainTaskId']
        mainTaskDeadline = request.POST['mainTaskDeadline'] if request.POST['mainTaskDeadline'] != 'null'else None
        task = Task.objects.get(id=mainTaskId)
        task.deadline = mainTaskDeadline
        task.save()
        return JsonResponse({"message": 'success'}, status=200, safe=False)
      # endregion
      # region kiểm tra hoàn thành task child item
      elif request.POST['action'] == 'COMPLETE_CHILD_TASK_ITEM':
        taskID = request.POST['taskID']
        isComplete = request.POST['isComplete']
        print(taskID, isComplete)
        # task = Task.objects.get(id=taskID)
        # task.taskName = childTaskItemName
        # task.save()
        return JsonResponse({"message": 'success'}, status=200, safe=False)
      # endregion
      # region Xoá task child và task item
      elif request.POST['action'] == 'DELETE_TASK_CHILD_AND_ITEM':
        task = Task.objects.get(id=request.POST['taskID'])
        task.delete()
        deleteTaskChildAndItemContext = {
            "message": 'Xoá thành công'
        }
        return JsonResponse(json.dumps(deleteTaskChildAndItemContext), status=200, safe=False)
      # endregion
      # region Thêm mô tả task child
      elif request.POST['action'] == 'ADD_CHILD_TASK_DESC':
        task = Task.objects.get(id=request.POST['ChildTaskID'])
        task.taskDesc = request.POST['ChildTaskDecs']
        task.save()
        AddTaskChildDescContext = {
            "message": 'Thêm thành công'
        }
        return JsonResponse(json.dumps(AddTaskChildDescContext), status=200, safe=False)
      # endregion
      # region Xoá mô tả task child
      elif request.POST['action'] == 'DEL_CHILD_TASK_DESC':
        task = Task.objects.get(id=request.POST['ChildTaskID'])
        task.taskDesc = None
        task.save()
        DelTaskChildDescContext = {
            "message": 'Xoá thành công'
        }
        return JsonResponse(json.dumps(DelTaskChildDescContext), status=200, safe=False)
      # endregion
      # region Cho phép upload file
      elif request.POST['action'] == 'SET_ALLOW_ATTACHED':
        task = Task.objects.get(id=request.POST['taskID'])
        task.fileEnabled = json.loads(request.POST['isChecked'])
        task.save()
        DelTaskChildDescContext = {
            "message": 'Đã cho phép upload'
        }
        return JsonResponse(json.dumps(DelTaskChildDescContext), status=200, safe=False)
      # endregion
      # region Xoá task
      elif request.POST['action'] == 'DELETE_TASK':
        task = Task.objects.get(id=request.POST['taskId'])
        task.delete()
        DelTaskContext = {
            "message": 'Đã xoá công việc'
        }
        return JsonResponse(json.dumps(DelTaskContext), status=200, safe=False)
      # endregion
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
      years = SchoolYear.objects.all()
      projects = Project.objects.all()
      for user in User.objects.all():
        if user.is_Teacher:
          teacher.append(user)
        elif not user.is_Teacher and not user.is_superuser and not user.is_Reviewer and not user.is_Manager:
          student.append(user)

      context = {'teacher': teacher,
                 'student': student, 'projects': projects, 'years': years}
      return render(request, 'Pages/assignment.html', context)
  # endregion

  def post(self, request):
    if request.is_ajax:
      if request.POST['action'] == 'ASSIGNMENT_CREATE':
        student = User.objects.filter(
            id=request.POST.get('Student', None))
        teacher = User.objects.filter(
            id=request.POST.get('Teacher', None))
        year = SchoolYear.objects.get(Year_ID=request.POST.get('Year', None))
        data = {
            'Users': teacher | student,
            'schoolYear': year
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
          newassignment = {
              "id": newrecord.id,
              "year": cur_Project.schoolYear.Year_ID,
              "tid": tid,
              "sid": sid,
              "tname": tname,
              "sname": sname
          }
          return JsonResponse(json.dumps(newassignment), status=200, safe=False)
        else:
          print(assignment_form.errors)
          return JsonResponse({"error": assignment_form.errors}, status=400)
      elif request.POST['action'] == 'GET_STUDENT_YEAR':
        student = User.objects.get(id=request.POST['Student'])
        year = student.year.Year_ID if student.year else None
        context = {
            'year': year,
        }
        return JsonResponse(json.dumps(context), status=200, safe=False)
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
