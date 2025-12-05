from django.urls import path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoView, basename='todo')

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name="signup"),
    path('login/', views.SigninView.as_view(), name="login"),
    path('google-login/', views.GoogleLoginView.as_view(), name="google-login"),
    path('send-otp/', views.SendOTP.as_view(), name="send-otp"),
    path('verify-otp/', views.VerifyOTP.as_view(), name="verify-otp"),
    path('reset-password/', views.ResetPasswordView.as_view(), name="reset-password"),
    path('user/profile/', views.UserProfileView.as_view(), name="user-profile"),
    path('user/profile/upload/', views.UploadProfileImageView.as_view(), name="upload-profile-image")
]

urlpatterns += router.urls