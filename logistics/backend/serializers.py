from rest_framework import serializers
from .models import Truck, Checkpoint

class TruckSerializer(serializers.ModelSerializer):
    checkpoints = serializers.ListField(child=serializers.CharField(max_length=255), required=False)

    class Meta:
        model = Truck
        fields = ['id', 'truck_plate', 'origin', 'destination', 'status', 'tracking_number', 'checkpoints']

    def create(self, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', [])
        truck = Truck.objects.create(**validated_data)
        # Create Checkpoint instances for each location string in checkpoints_data
        for location in checkpoints_data:
            Checkpoint.objects.create(truck=truck, location=location)
        return truck

    def update(self, instance, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if checkpoints_data:
            # Remove existing checkpoints and add the new ones
            instance.checkpoints.all().delete()  # Clear existing checkpoints
            for location in checkpoints_data:
                Checkpoint.objects.create(truck=instance, location=location)

        return instance
