import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from accounts.models import CustomUser

try:
    user = CustomUser.objects.get(email='admin@campussarthi.com')
    print(f"User found: {user.email}")
    print(f"Is active: {user.is_active}")
    print(f"Is staff: {user.is_staff}")
    print(f"Is superuser: {user.is_superuser}")
    print(f"Role: {user.role}")
    print(f"Password check for 'admin123': {user.check_password('admin123')}")
    print(f"Password check for 'adminpassword': {user.check_password('adminpassword')}")
    
    # Just in case, let's reset it to 'admin123' so we are absolutely sure
    user.set_password('admin123')
    user.save()
    print("Password explicitly reset to 'admin123'.")
except CustomUser.DoesNotExist:
    print("Admin user does not exist.")
