import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from django.contrib.auth import get_user_model
from crew.models import CrewMember

User = get_user_model()

raw_names = """
Abhinandan Singh
Abhishek Kheechi
Abu Fahad
Adyasha Pattanaik
Aaliya Khan
Anjali Lodhi
Archana Mehra
Aarti Keswani
Arpana Chaubey
Arsh Ahmed
Devansh Mishra
Hari Shankar Prajapati
Hiba Nazir
Kahkasha Begum
Karan Rathore
Kritika Tekchandani
Mahendra Parmar
Muskan Ansari
Nain Singh Rajput
Om Dwivedi
Piyush Bramhe
Prateek Singh
Raja Babu
Raju Meena
Ram Bhandarkar
Richa Dutt
Ritik Gupta
Sahil Sahu
Sakshi Pawar
Saksham Sharma
Satish Rana
Shahroz Khan
Shiva Soni
Sudhanshu Saw
Suyash Rajpurohit
Ved Yadav
"""

# Split, strip, remove empty lines
names = [n.strip() for n in raw_names.split('\n') if n.strip()]

# Remove duplicates while preserving order
seen = set()
unique_names = []
for name in names:
    if name not in seen:
        unique_names.append(name)
        seen.add(name)

# Sort alphabetically
unique_names.sort()

# Create or update records
created_count = 0
for name in unique_names:
    email = f"{name.lower().replace(' ', '.')}@campussarthi.com"
    
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'full_name': name,
            'role': 'crew',
            'is_active': True,
        }
    )
    if created:
        user.set_password('crew123')
        user.save()
        created_count += 1
    
    CrewMember.objects.get_or_create(
        user=user,
        defaults={
            'title': 'Placement Coordinator',
            'department': 'T&P Cell',
            'bio': f'Placement Coordinator for {name}.'
        }
    )

print(f"Successfully processed {len(unique_names)} unique crew members. Created {created_count} new users.")
