from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import TodoSerializers, SigninSerializers, SignupSerializers
from .models import Todo, EmailOTP
import requests
from rest_framework.permissions import IsAuthenticated
import random
from django.core.mail import send_mail

#Todo view

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#Authentication views

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Account created"}, status=status.HTTP_201_CREATED)
    
class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SigninSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email
        })
    
#Google Signin view

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get("token")

        if not access_token:
            return Response({"error": "Token missing"}, status=400)

        try:
            userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
            params = {"access_token": access_token}

            r = requests.get(userinfo_url, params=params)
            data = r.json()

            print("GOOGLE USERINFO:", data)

            email = data.get("email")
            name = data.get("name")

            if not email:
                return Response({"error": "Cannot get email from Google"}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                username = email.split("@")[0]
                user = User.objects.create_user(username=username, email=email)

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": email,
                "name": name
            })

        except Exception as e:
            print("GOOGLE LOGIN ERROR:", e)
            return Response({"error": "Google verification failed"}, status=400)

#OTP sending view

class SendOTP(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "email required"}, status=400)
        
        try:
            user = User.objects.get(email=email)
        except:
            return Response({"error": "User not found"}, status=404)
        
        otp = str(random.randint(1000, 9999))
        EmailOTP.objects.create(user=user, otp=otp)

        send_mail(
            subject="Your OTP Code",
            message=f'Your OTP is {otp}',
            from_email=None,
            recipient_list=[email]
        )

        return Response({"message": "OTP sent"})

#OTP verification

class VerifyOTP(APIView):
    def post(Self, request):
        email = request.data.get("email")
        otp_entered = request.data.get("otp")

        try:
            user = User.objects.get(email=email)
        except:
            return Response({"error": "User not found"}, status=404)
        
        try:
            latest_otp = EmailOTP.objects.filter(user=user).latest("created_at")
        except:
            return Response({"error": "OTP not found"}, status=404)
        if latest_otp.otp == otp_entered:
            return Response({"message": "OTP verified"})
        else:
            return Response({"error": "Invalid OTP"}, status=400)