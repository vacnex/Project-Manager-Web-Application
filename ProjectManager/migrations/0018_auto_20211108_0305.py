# Generated by Django 3.2.8 on 2021-11-08 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0017_auto_20211104_0206'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='fieldEnabled',
        ),
        migrations.AddField(
            model_name='task',
            name='fileEnabled',
            field=models.BooleanField(default=False),
        ),
    ]
