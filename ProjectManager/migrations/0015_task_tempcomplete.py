# Generated by Django 3.1.7 on 2021-10-12 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0014_auto_20211011_1356'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='tempComplete',
            field=models.BooleanField(default=False),
        ),
    ]
