from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
# Create your models here.

class User(AbstractUser):
    pass
    gender_choice = ((0, 'Nữ'), (1, 'Nam'))
    gender = models.IntegerField(choices=gender_choice,default=0)
    address = models.CharField(default='', max_length=255, blank=True)
    phone_regex = RegexValidator(
        regex=r'(:?^|\s)(09|08|03|07|05)+([0-9]{8})\b', message="Số điện thoại phải bắt đầu với những đầu số sau (09,08,07,05,03) và có 10 chữ số.")
    phone_number = models.CharField(
        validators=[phone_regex], max_length=10, blank=True)

