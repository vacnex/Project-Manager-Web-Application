from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
# Create your models here.

class User(AbstractUser):
    is_Teacher = models.BooleanField(default=False)
    gender_choice = ((0, 'Nữ'), (1, 'Nam'))
    gender = models.IntegerField(choices=gender_choice,default=0)
    address = models.CharField(default='', max_length=255, blank=True)
    phone_regex = RegexValidator(
        regex=r'(:?^|\s)(09|08|03|07|05)+([0-9]{8})\b', message="Số điện thoại phải bắt đầu với những đầu số sau (09,08,07,05,03) và có 10 chữ số.")
    phone_number = models.CharField(
        validators=[phone_regex], max_length=10, blank=True)
    _Class = models.ForeignKey(
        'SchoolClass', on_delete=models.CASCADE, default=None, blank=True, null=True)


class SchoolClass(models.Model):
    ClassID = models.CharField(max_length=10, primary_key=True)

    def __str__(self):
        return self.ClassID


class Course(models.Model):
    Course_ID = models.CharField(max_length=10, primary_key=True)
    Course_Name = models.CharField(max_length=255)

    def __str__(self):
        return self.Course_Name


class Project(models.Model):
    Project_ID = models.CharField(max_length=10, primary_key=True)
    Project_Name = models.CharField(max_length=255)
    Project_Content = models.TextField(blank=True)
    Is_Done = models.BooleanField(default=False)
    courses = models.ForeignKey('Course', on_delete=models.CASCADE, default=None)
    Users = models.ManyToManyField('User')

    def __str__(self):
        return self.Project_Name

    def Project_members(self):
        return "\n".join([u.username for u in self.Users.all()])
