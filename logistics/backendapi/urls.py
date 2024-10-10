from django.urls import path
from .views import backendapigps


urlpatterns = [
    path('gpsdata/', backendapigps.as_view(), name="gpsdata"),
    
    
    
]