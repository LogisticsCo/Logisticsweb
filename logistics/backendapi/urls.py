from django.urls import path
from .views import backendapires


urlpatterns = [
    path('tokens/', backendapires.as_view(), name="homepage"),
    
    
    
]