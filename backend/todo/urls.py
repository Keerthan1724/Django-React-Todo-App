from django.urls import path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoView, basename='todo')

urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    path('login/', views.SigninView.as_view()),
    path('google-login/', views.GoogleLoginView.as_view(), name="google-login"),
    path('send-otp/', views.SendOTP.as_view()),
    path('verify-otp/', views.VerifyOTP.as_view()),
]

urlpatterns += router.urls