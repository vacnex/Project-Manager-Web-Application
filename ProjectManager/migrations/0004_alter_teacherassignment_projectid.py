# Generated by Django 3.2.7 on 2021-09-19 15:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ProjectManager', '0003_teacherassignment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teacherassignment',
            name='ProjectID',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='ProjectManager.project'),
        ),
    ]
