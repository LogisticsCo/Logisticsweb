from django.urls import path
from .views import 


urlpatterns = [
    path('', backendapires.as_view(), name="homepage"),
    path('location/', locationapi.as_view(), name="location"),
    
    
]