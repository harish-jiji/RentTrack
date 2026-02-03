from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Property, Booking, Favorite, Payment
from .serializers import (
    UserSerializer, RegisterSerializer, PropertySerializer, 
    BookingSerializer, FavoriteSerializer, UserProfileUpdateSerializer
)
from datetime import datetime
import math

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.userprofile.role == 'ADMIN')

# ----------------- Auth -----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        profile_serializer = UserProfileUpdateSerializer(user.userprofile, data=request.data, partial=True)
        # Handle User model fields if needed (first_name, last_name)
        
        if profile_serializer.is_valid():
            profile_serializer.save()
            return Response(UserSerializer(user).data)
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------- Properties -----------------
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def property_list(request):
    if request.method == 'GET':
        properties = Property.objects.filter(status='AVAILABLE')
        serializer = PropertySerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not (request.user.is_authenticated and request.user.userprofile.role == 'ADMIN'):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def property_detail(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PropertySerializer(property, context={'request': request})
        return Response(serializer.data)

    if not (request.user.is_authenticated and request.user.userprofile.role == 'ADMIN'):
         return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = PropertySerializer(property, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        property.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ----------------- Bookings -----------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def booking_list(request):
    if request.method == 'GET':
        if request.user.userprofile.role == 'ADMIN':
            bookings = Booking.objects.all()
        else:
            bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Calculate months and total amount
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        property_id = request.data.get('property')
        
        try:
            property_obj = Property.objects.get(id=property_id)
            
            # Backend Calculation Logic
            try:
                s_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                e_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                
                # Calculate months
                diff_days = (e_date - s_date).days
                if diff_days <= 0:
                     return Response({'detail': 'End date must be after start date'}, status=status.HTTP_400_BAD_REQUEST)
                
                months = math.ceil(diff_days / 30.0)
                months = max(1, months)
                total_amount = months * property_obj.price_per_month
            except (ValueError, TypeError):
                 return Response({'detail': 'Invalid dates provided'}, status=status.HTTP_400_BAD_REQUEST)

        except Property.DoesNotExist:
             return Response({'detail': 'Property not found'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
             serializer.save(user=request.user, total_amount=total_amount, months=months)
             return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def booking_action(request, pk, action):
    if request.user.userprofile.role != 'ADMIN':
        return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if action == 'approve':
        booking.status = 'CONFIRMED'
        booking.property.status = 'BOOKED'
        booking.property.save()
    elif action == 'reject':
        booking.status = 'REJECTED'
        booking.property.status = 'AVAILABLE'
        booking.property.save()
    else:
        return Response({'detail': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
    
    booking.save()
    return Response(BookingSerializer(booking).data)

# ----------------- Favorites -----------------
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorite_list(request, pk=None):
    if request.method == 'GET':
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE' and pk:
        try:
            fav = Favorite.objects.get(pk=pk, user=request.user)
            fav.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# ----------------- Admin User Management -----------------
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_management(request, pk=None):
    if request.user.userprofile.role != 'ADMIN':
         return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)
    
    if request.method == 'PUT' and pk:
        try:
            target_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        target_user.userprofile.is_banned = request.data.get('is_banned', target_user.userprofile.is_banned)
        target_user.userprofile.save()
        return Response(UserSerializer(target_user).data)