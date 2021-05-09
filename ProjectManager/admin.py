from django.contrib import admin
from .models import User, Course, Project, SchoolClass
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm


# Register your models here.

class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User

class MyUserAdmin(UserAdmin):
    form = MyUserChangeForm
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('gender',
                           'address', 'phone_number', 'is_Teacher', '_Class',)}),
    )
    list_display = ('username', 'email',
                    'is_staff', 'is_Teacher', '_Class',)

class MyCourseAdmin (admin.ModelAdmin):
    model = Course
    list_display = ('Course_ID', 'Course_Name')

class MyProjectAdmin (admin.ModelAdmin):
    model = Project
    list_display = ('Project_ID', 'Project_Name', 'Is_Done', 'Project_members')

class MySchoolClassAdmin (admin.ModelAdmin):
    model = SchoolClass
    list_display = ('ClassID',)

admin.site.register(User, MyUserAdmin)
admin.site.register(Course, MyCourseAdmin)
admin.site.register(Project, MyProjectAdmin)
admin.site.register(SchoolClass, MySchoolClassAdmin)



