from django.contrib import admin
from .models import User, Course
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
# Register your models here.

class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User

class MyUserAdmin(UserAdmin):
    form = MyUserChangeForm
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('gender', 'address', 'phone_number')}),
    )

admin.site.register(User, MyUserAdmin)
admin.site.register(Course)
