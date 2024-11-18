from rest_framework import serializers
from .models import Truck, Checkpoint

class CheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['location']


class TruckSerializer(serializers.ModelSerializer):
    checkpoints = serializers.ListField(child=serializers.CharField(max_length=255))

    class Meta:
        model = Truck
        fields = ['id', 'truck_plate', 'origin', 'destination', 'status', 'tracking_number', 'checkpoints']

    def create(self, validated_data):
        # Pop the checkpoints data from validated_data
        checkpoints_data = validated_data.pop('checkpoints', [])

        # Create the Truck instance
        truck = Truck.objects.create(**validated_data)  
        
        # Create related Checkpoint instances based on the list of locations
        for location in checkpoints_data:
            Checkpoint.objects.create(truck=truck, location=location)
            
        return truck

    def update(self, instance, validated_data):
        # Pop the checkpoints data if provided
        checkpoints_data = validated_data.pop('checkpoints', None)

        # Update the other fields of the Truck instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If checkpoints data is provided, update them
        if checkpoints_data:
            # Delete the old checkpoints if necessary (depends on your use case)
            Checkpoint.objects.filter(truck=instance).delete()
            
            # Create new Checkpoints based on the data provided
            for location in checkpoints_data:
                Checkpoint.objects.create(truck=instance, location=location)

        return instance
