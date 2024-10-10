from django.urls import path
from .views import backendapigps,backendapitoken 


urlpatterns = [
    path('gpsdata/', backendapigps.as_view(), name="gpsdata"),
    path('tokens/', backendapitoken.as_view(), name="tokens"),
    
    
]