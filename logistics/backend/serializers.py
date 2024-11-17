# serializers.py
from rest_framework import serializers
from .models import Truck, Checkpoint

class CheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['id', 'location']

class TruckSerializer(serializers.ModelSerializer):
    checkpoints = CheckpointSerializer(many=True, required=False)  

    class Meta:
        model = Truck
        fields = ['id', 'truck_plate', 'origin', 'destination', 'status', 'tracking_number', 'checkpoints']
    
  
    def create(self, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', [])
        truck = Truck.objects.create(**validated_data)  # Create the truck instance
        # Creating associated checkpoints if provided in the request
        for checkpoint_data in checkpoints_data:
            Checkpoint.objects.create(truck=truck, **checkpoint_data)
        return truck

    # Optional: Overriding the 'update' method for PUT/PATCH requests (if needed)
    def update(self, instance, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if checkpoints_data:
           
            for checkpoint_data in checkpoints_data:
                Checkpoint.objects.update_or_create(truck=instance, **checkpoint_data)
        return instance
