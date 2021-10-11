from django.contrib import admin
from .models import User, SchoolYear, ProjectType, Project, SchoolClass, ProjectDiscus, Task
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
                           'address', 'phone_number', 'Class', 'is_Manager', 'is_Teacher', 'is_Reviewer')}),
    )
    list_display = ('username', 'email',
                    'is_staff', 'Class', 'is_Manager', 'is_Teacher', 'is_Reviewer')


class MySchoolYearAdmin (admin.ModelAdmin):
    model = SchoolYear
    list_display = ('Year_ID',)


class MyProjectTypeAdmin (admin.ModelAdmin):
    model = ProjectType
    list_display = ('type_Name',)


class MyProjectAdmin (admin.ModelAdmin):
    model = Project
    list_display = ('Project_Name', 'Project_members')


class MyProjectDiscussAdmin (admin.ModelAdmin):
    model = ProjectDiscus
    list_display = ('Project', 'Users', 'timeStamp','message',)

class MySchoolClassAdmin (admin.ModelAdmin):
    model = SchoolClass
    list_display = ('ClassID',)


class MyTaskAdmin (admin.ModelAdmin):
    model = Task
    list_display = ('taskName', 'taskDesc', 'parentTask', 'createdTaskDate',
                    'editedTaskDate', 'deadline', 'priority', 'complete')

admin.site.register(User, MyUserAdmin)
admin.site.register(SchoolYear, MySchoolYearAdmin)
admin.site.register(Project, MyProjectAdmin)
admin.site.register(ProjectDiscus, MyProjectDiscussAdmin)
admin.site.register(SchoolClass, MySchoolClassAdmin)
admin.site.register(ProjectType, MyProjectTypeAdmin)
admin.site.register(Task, MyTaskAdmin)

