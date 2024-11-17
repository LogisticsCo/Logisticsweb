from django.urls import path
from .views import login,register,TruckCreateView


urlpatterns = [
    path('login/', login, name="homepage"),
    path('register/', register, name="location"),
    path('trucks/', TruckCreateView.as_view(), name='truck-create'),
    
    
]