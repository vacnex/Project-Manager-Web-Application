# Generated by Django 3.1.7 on 2021-10-11 13:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0012_auto_20211006_1620'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='taskChhild',
            new_name='parentTask',
        ),
    ]