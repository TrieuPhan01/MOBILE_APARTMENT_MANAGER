# Generated by Django 5.0.4 on 2024-05-12 15:32

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('QlChungCu', '0032_alter_carcard_status_card'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar_acount',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
    ]
