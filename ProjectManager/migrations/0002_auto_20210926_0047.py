# Generated by Django 3.2.7 on 2021-09-25 17:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='Is_Confirm',
        ),
        migrations.RemoveField(
            model_name='project',
            name='Is_Done',
        ),
        migrations.RemoveField(
            model_name='project',
            name='Project_Content',
        ),
        migrations.RemoveField(
            model_name='project',
            name='TeacherAssignment',
        ),
        migrations.RemoveField(
            model_name='project',
            name='Type',
        ),
        migrations.RemoveField(
            model_name='project',
            name='Users',
        ),
        migrations.RemoveField(
            model_name='project',
            name='description',
        ),
        migrations.RemoveField(
            model_name='project',
            name='schoolYear',
        ),
    ]
