from django.shortcuts import render, redirect
import re 
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
import json
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
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
from .models import Location, Order,Coordinates
import os
import random
import string
from django.core.mail import send_mail
from dotenv import load_dotenv
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Order, Coordinates
from django.template.loader import render_to_string


load_dotenv()
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN')

@csrf_exempt
@permission_classes([AllowAny])
def update_order_status(request, order_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_status = data.get('status')
        print(new_status)
        if new_status is None:
            return JsonResponse({'error': 'Status is required'}, status=400)

        
        order = get_object_or_404(Order, tracking_number=order_id)
        print(order)
        
        order.status = new_status
        order.save()

        return JsonResponse({'message': 'Order status updated successfully', 'status': order.status})

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@permission_classes([AllowAny])
@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            order_number = body.get('orderNumber')
            email = body.get('email')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

        if not order_number or not email:
            return JsonResponse({'message': 'Order number and email are required'}, status=400)

        order = get_object_or_404(Order, tracking_number=order_number)
        coordinates = Coordinates.objects.filter(order_id=order_number)

        coordinates_info = ""
        if coordinates.exists():
            coordinates_info = "\n".join(
                [f"Latitude: {coord.latitude}, Longitude: {coord.longitude}, Date: {coord.created_at}" for coord in coordinates]
            )
        else:
            coordinates_info = "No coordinates available for this order."

        email_content = f"""
        Order Update:
        
        Order Number: {order.tracking_number}
        Order Status: {order.status}

        Coordinates Information:
        {coordinates_info}
        """

        try:
            send_mail(
                'Order Information Update',
                email_content,
                'frandelwanjawa19@gmail.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'Email sent successfully!'}, status=200)
        except Exception as e:
            return JsonResponse({'message': f"Error sending email: {str(e)}"}, status=500)

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

@permission_classes([AllowAny])
class TruckCreateView(APIView):
    def get(self, request, *args, **kwargs):  # Add the 'get' method
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

            # Return the order details as a JSON response
            return JsonResponse(order_details, safe=False)

        except Exception as e:
            # Return error message in case of an exception
            return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    try:
        data = request.data
        username = data['username']
        email = data.get('email')
        password = data['password']
        print(data)

        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists. Log in"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email = email,
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
            
            data = dict(request.data)
            print("QueryDict Data:", data)

            
            data_json = data.get('_content', '')
            print(data_json)
            data_json = data_json[0].replace("\r\n", "")  
            data = json.loads(data_json)
            print("Extracted Data:", data)

        print(data)
        username = data.get('username')
        password = data.get('password')
        
        
        user = authenticate(username=username, password=password)

        if user is not None:
            
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'username': user.username,
                    'email': user.email,

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
            
            data = json.loads(request.body)
            tracking_number = data.get("tracking_number")
            truck_plate = data.get("truck_plate")
            status = data.get("status")
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
                    "access_token": os.environ.get('MAPBOX_ACCESS_TOKEN'),
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
            checkpoint_coords = [fetch_coordinates(
                name) for name in checkpoints_names]

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


@permission_classes([AllowAny])
class ForgotPasswordAPIView(APIView):
    
    def post(self, request, *args, **kwargs):
        
        email = request.data.get('email')  

        
        if not email:
            return Response({'error': 'Email is required.'}, status=400)

        try:
            # Try to find the user by email
            user = User.objects.get(email=email)

            # Generate a new password
            new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
            
            # Set the new password for the user and save
            user.set_password(new_password)
            user.save()

            
            send_mail(
                'Password Reset',
                f'Your new password is: {new_password}',
                'frandelwanjawa19@gmail.com',  
                [email],  
                fail_silently=False,  
            )

            
            return Response({'message': 'A new password has been sent to your email.'}, status=200)

        except User.DoesNotExist:
            
            return Response({'error': 'User with this email does not exist.'}, status=404)

        except Exception as e:
            
            return Response({'error': str(e)}, status=500)

@permission_classes([AllowAny])
@csrf_exempt
def save_coordinates(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            latitude = data.get('lat')
            longitude = data.get('lon')
            order_id = data.get('od')

            if latitude is None or longitude is None or not order_id:
                return JsonResponse({"error": "latitude, longitude, and order_id are required"}, status=400)

            coordinates = Coordinates(latitude=latitude, longitude=longitude, order_id=order_id)
            coordinates.save()

            return JsonResponse({"message": "Coordinates saved successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    elif request.method == "GET":
        order_id = request.GET.get('order_id')
        if not order_id:
            return JsonResponse({"error": "order_id is required"}, status=400)

        coordinates = Coordinates.objects.filter(order_id=order_id).order_by('created_at')
        data = [
            {
                "latitude": coord.latitude,
                "longitude": coord.longitude,
                "created_at": coord.created_at.isoformat()
            }
            for coord in coordinates
        ]
        return JsonResponse({"coordinates": data}, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@permission_classes([AllowAny])
@csrf_exempt
def receive_mqtt_data(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)

            # Extract the topic and payload
            topic = data.get('topic')
            payload = data.get('payload')

            # Log the received topic and payload
            print(f"Received Topic: {topic}")
            print(f"Received Payload: {payload}")

            # Separate the payload into key-value pairs using regex
            parsed_data = dict(re.findall(r'(\w+)=([\w\.-]+)', payload))

            # Extract od, lat, and lon from the parsed data
            od = parsed_data.get('od')
            lat = parsed_data.get('lat')
            lon = parsed_data.get('lon')
            coordinates = Coordinates(latitude=lat, longitude=lon, order_id=od)
            coordinates.save()
            # Log the separated values
            print(f"OD: {od}, Latitude: {lat}, Longitude: {lon}")

            # Construct a response with the separated data
            return JsonResponse({
                'status': 'success',
                'message': 'Data received successfully',
                'data': {
                    'od': od,
                    'lat': lat,
                    'lon': lon
                }
            })
        except Exception as e:
            # Handle any errors during processing
            print(f"Error: {e}")
            return JsonResponse({'status': 'error', 'message': 'Invalid data format'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method'}, status=405)


