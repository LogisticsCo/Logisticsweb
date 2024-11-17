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
        truck = Truck.objects.create(**validated_data)
        for checkpoint_data in checkpoints_data:
            Checkpoint.objects.create(truck=truck, **checkpoint_data)
        return truck
