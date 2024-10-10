from django.urls import path
from .views import login,register


urlpatterns = [
    path('login/', login, name="homepage"),
    path('register/', register, name="location"),
    
    
]