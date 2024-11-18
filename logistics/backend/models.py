from django.db import models

class Coordinates(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lat: {self.latitude}, Long: {self.longitude}"
    


class Truck(models.Model):
    truck_plate = models.CharField(max_length=20)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    status = models.CharField(max_length=50, null=True, blank=True)
    tracking_number = models.CharField(max_length=6, unique=True)
    checkpoint_1 = models.CharField(max_length=255, null=True, blank=True)
    checkpoint_2 = models.CharField(max_length=255, null=True, blank=True)
    checkpoint_3 = models.CharField(max_length=255, null=True, blank=True)
    checkpoint_4 = models.CharField(max_length=255, null=True, blank=True)
    checkpoint_5 = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.truck_plate
