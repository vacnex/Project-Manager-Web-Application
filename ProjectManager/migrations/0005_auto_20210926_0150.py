# Generated by Django 3.2.7 on 2021-09-25 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0004_auto_20210926_0054'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='Is_Confirm',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='project',
            name='Is_Done',
            field=models.BooleanField(default=False),
        ),
    ]
