# Generated by Django 5.0.4 on 2024-05-08 04:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QlChungCu', '0016_user_is_staff_user_is_superuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_role',
            field=models.CharField(choices=[('Resident', 'Resident'), ('Admin', 'Admin')], default='Resident', max_length=20),
        ),
    ]
