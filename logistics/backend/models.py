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


class Location(models.Model):
    name = models.CharField(max_length=255)  
    latitude = models.FloatField()  
    longitude = models.FloatField()  
    is_checkpoint = models.BooleanField(default=False)  

    def __str__(self):
        return self.name


class Order(models.Model):
    tracking_number = models.CharField(max_length=100, unique=True)  # Order ID
    truck_plate = models.CharField(max_length=200)
    status = models.CharField(max_length=200)
    origin = models.ForeignKey(Location, related_name="order_origin", on_delete=models.CASCADE)
    destination = models.ForeignKey(Location, related_name="order_destination", on_delete=models.CASCADE)
    checkpoints = models.ManyToManyField(Location, related_name="order_checkpoints", blank=True)

    def __str__(self):
        return f"Order {self.tracking_number}"
