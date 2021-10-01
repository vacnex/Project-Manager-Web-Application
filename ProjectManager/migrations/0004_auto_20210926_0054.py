# Generated by Django 3.2.7 on 2021-09-25 17:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0003_auto_20210926_0053'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='Users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='project',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='project',
            name='schoolYear',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ProjectManager.schoolyear'),
        ),
    ]