import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rent.settings')
django.setup()

from myapp.models import Property

print("Cleaning up properties with missing titles...")
count = Property.objects.filter(title__isnull=True).update(title="Untitled Property")
print(f"Fixed {count} properties.")
