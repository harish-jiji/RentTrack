from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Property, Booking, Favorite, Payment

# ----------------- User Serializers -----------------
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role', read_only=True)
    phone = serializers.CharField(source='userprofile.phone', read_only=True)
    address = serializers.CharField(source='userprofile.address', read_only=True)
    is_banned = serializers.BooleanField(source='userprofile.is_banned', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'is_banned']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Profile is created by signal
        return user

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'address']

# ----------------- Property Serializers -----------------
class PropertySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback if request context is missing
            return obj.image.url
        return None

# ----------------- Booking Serializers -----------------
class BookingSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['total_amount', 'status', 'user']

# ----------------- Favorite Serializers -----------------
class FavoriteSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ['user']

# ----------------- Payment Serializers -----------------
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
