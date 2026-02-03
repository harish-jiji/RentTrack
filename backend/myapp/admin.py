from django.contrib import admin
from .models import UserProfile, Property, Booking

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Property)
admin.site.register(Booking)