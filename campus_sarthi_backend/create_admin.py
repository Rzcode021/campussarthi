import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'admin@campussarthi.com'
password = 'admin123'

user, created = User.objects.get_or_create(email=email, defaults={'username': email})
user.set_password(password)
user.is_staff = True
user.is_superuser = True
user.role = 'admin'
user.save()

if created:
    print(f"✅ Superuser created — email: {email}, password: {password}")
else:
    print(f"✅ Superuser password reset — email: {email}, password: {password}")
