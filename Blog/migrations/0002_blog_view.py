# Generated by Django 3.2.7 on 2021-11-22 01:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='view',
            field=models.IntegerField(default=0),
        ),
    ]
