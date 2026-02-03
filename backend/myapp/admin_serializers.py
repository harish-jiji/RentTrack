from rest_framework import serializers
from django.contrib.auth.models import User
from myapp.models import Property, Booking, UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', read_only=True)
    is_banned = serializers.BooleanField(source='userprofile.is_banned', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_banned']

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
