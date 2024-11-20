from django.urls import path
from .views import login,register,TruckCreateView,update_order_status,refresh_access_token,save_coordinates,create_order,get_order_coordinates,ForgotPasswordAPIView


urlpatterns = [
    path('login/', login, name="homepage"),
    path('register/', register, name="location"),
    path('trucks/', TruckCreateView.as_view(), name='truck-create'),
    path("token/refresh/", refresh_access_token, name="token_refresh"),
    path('create-order/', create_order, name='create_order'),
    path('order/<str:order_id>/coordinates/', get_order_coordinates, name='get_order_coordinates'),
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot_password'),
    path('coordinates/', save_coordinates, name='save_coordinates'),
    path('order/<str:order_id>/status/', update_order_status, name='update_order_status'),
    
]