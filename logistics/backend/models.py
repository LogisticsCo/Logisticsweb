from django.db import models

class Coordinates(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lat: {self.latitude}, Long: {self.longitude}"
    


class Truck(models.Model):
    truck_plate = models.CharField(max_length=255)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    tracking_number = models.CharField(max_length=255)

    def __str__(self):
        return self.truck_plate


class Checkpoint(models.Model):
    truck = models.ForeignKey(Truck, related_name='checkpoints', on_delete=models.CASCADE)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.location
