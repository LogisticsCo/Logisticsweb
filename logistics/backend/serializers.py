from rest_framework import serializers
from .models import Truck

class TruckSerializer(serializers.ModelSerializer):
    checkpoints = serializers.ListField(
        child=serializers.CharField(max_length=255), required=False, allow_null=True
    )

    class Meta:
        model = Truck
        fields = ['id', 'truck_plate', 'origin', 'destination', 'status', 'tracking_number', 'checkpoints']

    def validate_checkpoints(self, value):
        # Ensure the list has at most 5 elements
        if value and len(value) > 5:
            raise serializers.ValidationError("You can provide a maximum of 5 checkpoints.")
        return value

    def create(self, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', [])
        truck = Truck.objects.create(**validated_data)

        # Assign checkpoints to separate fields if available
        for i, checkpoint in enumerate(checkpoints_data):
            setattr(truck, f'checkpoint_{i+1}', checkpoint)
        truck.save()

        return truck

    def update(self, instance, validated_data):
        checkpoints_data = validated_data.pop('checkpoints', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update the checkpoints if any are provided
        for i, checkpoint in enumerate(checkpoints_data):
            setattr(instance, f'checkpoint_{i+1}', checkpoint)
        instance.save()

        return instance
