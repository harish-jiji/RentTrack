from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

# ----------------- User Profile Model -----------------
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('USER', 'User'),
        ('ADMIN', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_banned = models.BooleanField(default=False)

    def __str__(self):
        if self.user:
            return f"{self.user.username} - {self.role}"
        return f"Unlinked Profile - {self.role}"

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

# ----------------- Property Model -----------------
class Property(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BOOKED', 'Booked'),
        ('SOLD', 'Sold'),
    ]

    title = models.CharField(max_length=150, null=True)
    description = models.TextField(null=True)
    price_per_month = models.FloatField(null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    # Owner info
    owner_name = models.CharField(max_length=100, null=True, blank=True)
    owner_contact = models.CharField(max_length=100, null=True, blank=True)
    
    address = models.TextField(null=True)
    image = models.ImageField(upload_to='property_images/', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, null=True)
    updated_at = models.DateField(auto_now=True, null=True)

    def __str__(self):
        return self.title

# ----------------- Booking Model -----------------
class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    months = models.IntegerField(null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"Booking {self.id} - {self.property.title} by {self.user.username}"

# ----------------- Favorite Model -----------------
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.property.title}"

# ----------------- Payment Model -----------------
class Payment(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('DUE', 'Due'),
    ]
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DUE')
    payment_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Payment for Booking {self.booking.id}"
