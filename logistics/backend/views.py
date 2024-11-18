from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
import json
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .models import Truck
from .serializers import TruckSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import requests
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from .models import Location, Order
import os
from dotenv import load_dotenv

load_dotenv()
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN') 


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_access_token(request):
    
    try:
        
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        return Response({"access": access_token}, status=status.HTTP_200_OK)
    except InvalidToken:
        return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
    except TokenError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class TruckCreateView(APIView):
    try:
        
        orders = Order.objects.all()

        order_details = [
            {
                "order_id": order.id,
                "tracking_number": order.tracking_number,
                "truck_plate": order.truck_plate,
                "status": order.status,
                "origin": {
                    "name": order.origin.name,
                    "latitude": order.origin.latitude,
                    "longitude": order.origin.longitude,
                },
                "destination": {
                    "name": order.destination.name,
                    "latitude": order.destination.latitude,
                    "longitude": order.destination.longitude,
                },
                "checkpoints": [
                    {
                        "name": checkpoint.name,
                        "latitude": checkpoint.latitude,
                        "longitude": checkpoint.longitude,
                    }
                    for checkpoint in order.checkpoints.all()
                ]
            }
            for order in orders
        ]

        return JsonResponse(order_details, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    try:
        data = request.data
        username = data['username']
        
        password = data['password']
        print(data)
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists. Log in"}, status=status.HTTP_400_BAD_REQUEST)

        

        user = User.objects.create(
            username=username,
            
            password=make_password(password),
        )
        user.save()
        return Response({"detail": "User created successfully!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([AllowAny])
def get_order_coordinates(request, order_id):
    try:
        order = Order.objects.get(tracking_number=order_id)
        
        order_details = {
            "order_id": order.id,
            "tracking_number": order.tracking_number,
            "truck_plate": order.truck_plate,
            "status": order.status,
            "origin": {
                "name": order.origin.name,
                "latitude": order.origin.latitude,
                "longitude": order.origin.longitude,
            },
            "destination": {
                "name": order.destination.name,
                "latitude": order.destination.latitude,
                "longitude": order.destination.longitude,
            },
            "checkpoints": [
                {
                    "name": checkpoint.name,
                    "latitude": checkpoint.latitude,
                    "longitude": checkpoint.longitude,
                }
                for checkpoint in order.checkpoints.all()
            ]
        }

        return JsonResponse(order_details)
    
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
        else:
            # Convert QueryDict to a dictionary
            data = dict(request.data)
            print("QueryDict Data:", data)
            
            # Extract JSON content from '_content' key
            data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
            print(data_json)
            data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
            data = json.loads(data_json)  # Convert JSON string to a Python dictionary
            print("Extracted Data:", data)

        
        print(data)
        username = data.get('username')
        password = data.get('password')
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Generate refresh and access tokens
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'username': user.username,
                    
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@permission_classes([AllowAny])
def create_order(request):
    if request.method == "POST":
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            tracking_number = data.get("tracking_number")
            truck_plate = data.get("truck_plate")
            status=data.get("status")
            origin_name = data.get("origin")
            destination_name = data.get("destination")
            checkpoints_names = data.get("checkpoints", [])

            # Validate required fields
            if not (tracking_number and origin_name and destination_name):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            # Function to fetch coordinates from Mapbox
            def fetch_coordinates(place_name):
                url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{place_name}.json"
                params = {
                    "access_token": MAPBOX_ACCESS_TOKEN,
                    "limit": 1,
                }
                try:
                    response = requests.get(url, params=params)
                    response_data = response.json()
                    if response_data["features"]:
                        feature = response_data["features"][0]
                        return {
                            "name": feature["place_name"],
                            "longitude": feature["geometry"]["coordinates"][0],
                            "latitude": feature["geometry"]["coordinates"][1],
                        }
                    else:
                        return None
                except Exception as e:
                    return None

            # Fetch coordinates for origin, destination, and checkpoints
            origin_coords = fetch_coordinates(origin_name)
            destination_coords = fetch_coordinates(destination_name)
            checkpoint_coords = [fetch_coordinates(name) for name in checkpoints_names]

            # If origin or destination coordinates are missing, return error
            if not (origin_coords and destination_coords):
                return JsonResponse({"error": "Failed to geocode origin or destination"}, status=400)

            # Save locations in the database inside a transaction block
            with transaction.atomic():
                origin = Location.objects.create(
                    name=origin_coords["name"],
                    latitude=origin_coords["latitude"],
                    longitude=origin_coords["longitude"],
                )
                destination = Location.objects.create(
                    name=destination_coords["name"],
                    latitude=destination_coords["latitude"],
                    longitude=destination_coords["longitude"],
                )

                checkpoints = []
                for checkpoint in checkpoint_coords:
                    if checkpoint:
                        checkpoint_location = Location.objects.create(
                            name=checkpoint["name"],
                            latitude=checkpoint["latitude"],
                            longitude=checkpoint["longitude"],
                            is_checkpoint=True,
                        )
                        checkpoints.append(checkpoint_location)

                # Create the order and associate with the locations
                order = Order.objects.create(
                    tracking_number=tracking_number,
                    truck_plate=truck_plate,
                    status=status,
                    origin=origin,
                    destination=destination,
                )
                order.checkpoints.set(checkpoints)

            # Return the success response with order details
            return JsonResponse({
                "message": "Order created successfully",
                "order_id": order.id,
                "tracking_number": order.tracking_number,
                "origin": origin_coords,
                "destination": destination_coords,
                "checkpoints": checkpoint_coords,
            })

        except Exception as e:
            # Handle any unexpected errors
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

