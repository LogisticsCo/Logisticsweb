# Generated by Django 5.1.1 on 2024-11-18 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_location_remove_orders_destination_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='truck_plate',
            field=models.CharField(max_length=100),
        ),
    ]