# serializers.py
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
        checkpoints_data = validated_data.pop('checkpoints', [])  
        truck = Truck.objects.create(**validated_data)  
        
        
        for location in checkpoints_data:
            Checkpoint.objects.create(truck=truck, location=location)
            
        return truck

   
    def update(self, instance, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if checkpoints_data:
            # Optionally, update the checkpoints here if needed
            for checkpoint_data in checkpoints_data:
                Checkpoint.objects.update_or_create(truck=instance, **checkpoint_data)
        return instance
