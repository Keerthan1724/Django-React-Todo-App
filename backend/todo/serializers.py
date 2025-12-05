from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Todo

#Todo Serializers

class TodoSerializers(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'completed', 'created_at']
        read_only_fields = ['user']

#Signup Serializers

class SignupSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validate_data):
        user = User.objects.create_user(
            username=validate_data['username'],
            email=validate_data['email'],
            password=validate_data['password']
        )
        return user
    
#Signin Serializers

class SigninSerializers(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

#UserProfile Serializers

class UserProfileSerializer(serializers.ModelSerializer):
    total_todos = serializers.SerializerMethodField()
    completed_todos = serializers.SerializerMethodField()
    pending_todos = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile_image', 'total_todos', 'completed_todos', 'pending_todos']

    def get_total_todos(self, obj):
        return Todo.objects.filter(user=obj).count()
    
    def get_completed_todos(self, obj):
        return Todo.objects.filter(user=obj, completed=True).count()
    
    def get_pending_todos(self, obj):
        return Todo.objects.filter(user=obj, completed=False).count()
    
    def get_profile_image(self, obj):
        if obj.profile.profile_image:
            return obj.profile.profile_image.url
        return ""