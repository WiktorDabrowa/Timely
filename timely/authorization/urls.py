from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('register/', views.UserCreate.as_view(), name='create_user'),
    # path('logout', views.logout_user)
]

urlpatterns
