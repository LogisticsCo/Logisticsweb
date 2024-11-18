# serializers.py
from rest_framework import serializers
from .models import Truck, Checkpoint

class CheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoint
        fields = ['id', 'location']

class TruckSerializer(serializers.ModelSerializer):
    

    checkpoints = serializers.ListField(required=False,child=serializers.CharField(max_length=255))

    class Meta:
        model = Truck
        fields = ['truck_plate', 'origin', 'destination', 'status', 'checkpoints']

    def create(self, validated_data):
        checkpoints_data = validated_data.pop('checkpoints')
        truck = Truck.objects.create(**validated_data)
        for checkpoint_location in checkpoints_data:
            Checkpoint.objects.create(truck=truck, location=checkpoint_location)
        return truck
