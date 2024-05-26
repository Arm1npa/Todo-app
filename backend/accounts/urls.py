from django.urls import path
from .views import *

urlpatterns = [
    path('login/', UserLoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('logout/', Logout.as_view(), name='user-logout'),
]
