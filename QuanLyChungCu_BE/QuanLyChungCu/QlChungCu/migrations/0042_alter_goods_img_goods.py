# Generated by Django 5.0.4 on 2024-05-28 12:14

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('QlChungCu', '0041_goods_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goods',
            name='img_goods',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True),
        ),
    ]
