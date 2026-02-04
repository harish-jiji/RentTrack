from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from myapp.models import Property, Booking, UserProfile
from .admin_serializers import PropertySerializer, UserSerializer, BookingSerializer
from .permissions import IsAdmin

# 📊 Admin Dashboard API
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_dashboard(request):
    return Response({
        "total_users": User.objects.count(),
        "total_properties": Property.objects.count(),
        "active_bookings": Booking.objects.filter(status='CONFIRMED').count(),
        "pending_bookings": Booking.objects.filter(status='PENDING').count(),
        # For revenue, you might want to sum up confirmed booking amounts
        # "revenue": ... 
    })

# 🏠 Property Management
@api_view(['GET', 'POST'])
@permission_classes([IsAdmin])
def admin_properties(request):
    if request.method == 'GET':
        props = Property.objects.all()
        return Response(PropertySerializer(props, many=True, context={'request': request}).data)

    if request.method == 'POST':
        serializer = PropertySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_property_detail(request, id):
    try:
        prop = Property.objects.get(id=id)
    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = PropertySerializer(prop, data=request.data, context={'request': request}) # partial=True maybe?
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        prop.delete()
        return Response({"message": "Property deleted"})

# 📅 Booking Approval / Reject
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_bookings(request):
    bookings = Booking.objects.all().order_by('-id')
    return Response(BookingSerializer(bookings, many=True).data)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def approve_booking(request, id):
    try:
        booking = Booking.objects.get(id=id)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
        
    booking.status = 'CONFIRMED'
    booking.property.status = 'BOOKED'
    booking.property.save()
    booking.save()
    return Response({"status": "Booking approved"})

@api_view(['PUT'])
@permission_classes([IsAdmin])
def reject_booking(request, id):
    try:
        booking = Booking.objects.get(id=id)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    booking.status = 'REJECTED'
    booking.property.status = 'AVAILABLE' # Ensure property is released if it was held
    booking.property.save()
    booking.save()
    return Response({"status": "Booking rejected"})

# 👥 User Management
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_users(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def ban_user(request, id):
    try:
        profile = UserProfile.objects.get(user__id=id)
        if profile.role == 'ADMIN':
             return Response({"error": "Cannot ban an admin"}, status=status.HTTP_400_BAD_REQUEST)
        profile.is_banned = True
        profile.save()
        return Response({"status": "User banned"})
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def unban_user(request, id):
    try:
        profile = UserProfile.objects.get(user__id=id)
        profile.is_banned = False
        profile.save()
        return Response({"status": "User unbanned"})
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

# 👑 Create Admin
@api_view(['POST'])
@permission_classes([IsAdmin])
def create_admin(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    # Signal creates profile, update it
    profile = UserProfile.objects.get(user=user)
    profile.role = 'ADMIN'
    profile.save()
    return Response({"status": "Admin created"})
