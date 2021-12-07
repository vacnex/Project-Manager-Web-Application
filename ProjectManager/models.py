from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db.models.fields import DateTimeField
import datetime
# Create your models here.

class User(AbstractUser):
    is_Manager = models.BooleanField(default=False)
    is_Teacher = models.BooleanField(default=False)
    is_Reviewer = models.BooleanField(default=False)
    gender_choice = ((0, 'Nữ'), (1, 'Nam'))
    gender = models.IntegerField(choices=gender_choice,default=0)
    address = models.CharField(default='', max_length=255, blank=True)
    phone_regex = RegexValidator(
        regex=r'(:?^|\s)(09|08|03|07|05)+([0-9]{8})\b', message="Số điện thoại phải bắt đầu với những đầu số sau (09,08,07,05,03) và có 10 chữ số.")
    phone_number = models.CharField(
        validators=[phone_regex], max_length=10, blank=True)
    Class = models.ForeignKey(
        'SchoolClass', on_delete=models.CASCADE, default=None, blank=True, null=True)
    year = models.ForeignKey(
        'SchoolYear', on_delete=models.CASCADE, default=None, blank=True, null=True)

    def __str__(self):
        return self.get_full_name()


class SchoolClass(models.Model):
    ClassID = models.CharField(max_length=10, primary_key=True)

    def __str__(self):
        return self.ClassID


class SchoolYear(models.Model):
    Year_ID = models.CharField(max_length=10, primary_key=True)

    def __str__(self):
        return self.Year_ID

class ProjectType(models.Model):
    type_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.type_Name

class Project(models.Model):
    Project_Name = models.CharField(max_length=255, null=True, blank=True)
    Type = models.ForeignKey(
        'ProjectType', on_delete=models.CASCADE, default=None,null=True)
    Project_Content = models.TextField(blank=True)
    schoolYear = models.ForeignKey(
        'SchoolYear', on_delete=models.CASCADE, default=None, null=True)
    Users = models.ManyToManyField('User')
    description = models.TextField(blank=True)
    Is_Done = models.BooleanField(default=False)
    Is_Confirm = models.BooleanField(default=False)

    def __str__(self):
        return self.Project_Name

    def Project_members(self):
        return "\n".join([u.username for u in self.Users.all()])

def UploadTaskFileLocation(instance, filename):
  return "media/task/%s/%s" % (instance.id, filename)

class Task(models.Model):
    taskName = models.CharField(max_length=255)
    Project = models.ForeignKey('Project', on_delete=models.CASCADE)
    taskDesc = models.TextField(null=True)
    parentTask = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE)
    createdTaskDate = DateTimeField(auto_now_add=True)
    editedTaskDate = DateTimeField(auto_now=True)
    deadline = models.CharField(max_length=255, null=True)
    priority = models.CharField(max_length=255, null=True)
    complete = models.BooleanField(default=False)
    tempComplete = models.BooleanField(default=False)
    file = models.FileField(null=True, blank=True,
                            upload_to=UploadTaskFileLocation)
    fileEnabled = models.BooleanField(default=False)
    def __str__(self):
        return self.taskName
    def daysleft(seft):
      if seft.deadline is not None:
        rawenddate = ((seft.deadline.strip().split('n')[1]).strip()).split('/')
        today = datetime.date.today()
        initenddate = datetime.date(int(rawenddate[2]), int(
            rawenddate[1]), int(rawenddate[0]))
        diff = initenddate -  today
        if diff.days == 0:
          return 'Hôm nay'
        elif diff.days > 0:
          return 'Còn ' + str(diff.days)+' ngày'
        elif diff.days < 0:
          return 'Trễ '+ str(abs(diff.days))+' ngày'

class ProjectDiscus(models.Model):
    Users = models.ForeignKey('User', on_delete=models.CASCADE)
    Project = models.ForeignKey('Project', on_delete=models.CASCADE)
    timeStamp = DateTimeField(auto_now_add=True)
    message = models.TextField(blank=False,unique=False)

    def __str__(self):
        return self.message
