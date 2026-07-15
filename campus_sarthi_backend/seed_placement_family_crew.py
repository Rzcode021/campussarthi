"""
Seed script: adds all crew members into the PlacementFamilyMember table.
Also includes the 6 named mentors/leads from the admin panel list.
Run from the campus_sarthi_backend directory:
    python seed_placement_family_crew.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from crew.models import PlacementFamilyMember

# ── Named senior members (Mentors) ────────────────────────────────────────────
mentors = [
    {"name": "Rahul Sharma",  "role": "Mentor", "hierarchy_level": 1},
    {"name": "Priya Desai",   "role": "Mentor", "hierarchy_level": 1},
    {"name": "Amit Joshi",    "role": "Mentor", "hierarchy_level": 1},
    {"name": "Sneha Patil",   "role": "Mentor", "hierarchy_level": 1},
    {"name": "Rohan Mehta",   "role": "Mentor", "hierarchy_level": 1},
    {"name": "Ananya Kumar",  "role": "Mentor", "hierarchy_level": 1},
]

# ── Placement Coordinators (Crew) ─────────────────────────────────────────────
crew_names = [
    "Aaliya Khan",
    "Aarti Keswani",
    "Abhinandan Singh",
    "Abhishek Kheechi",
    "Abu Fahad",
    "Adyasha Pattanaik",
    "Anjali Lodhi",
    "Archana Mehra",
    "Arpana Chaubey",
    "Arsh Ahmed",
    "Devansh Mishra",
    "Hari Shankar Prajapati",
    "Hiba Nazir",
    "Kahkasha Begum",
    "Karan Rathore",
    "Kritika Tekchandani",
    "Mahendra Parmar",
    "Muskan Ansari",
    "Nain Singh Rajput",
    "Om Dwivedi",
    "Piyush Bramhe",
    "Prateek Singh",
    "Raja Babu",
    "Raju Meena",
    "Ram Bhandarkar",
    "Richa Dutt",
    "Ritik Gupta",
    "Sahil Sahu",
    "Saksham Sharma",
    "Sakshi Pawar",
    "Satish Rana",
    "Shahroz Khan",
    "Shiva Soni",
    "Sudhanshu Saw",
    "Suyash Rajpurohit",
    "Ved Yadav",
]

created = 0
skipped = 0

# Add mentors
for m in mentors:
    obj, was_created = PlacementFamilyMember.objects.get_or_create(
        name=m["name"],
        role=m["role"],
        defaults={"hierarchy_level": m["hierarchy_level"]},
    )
    if was_created:
        created += 1
        print(f"  [NEW]    {m['role']:8s} → {m['name']}")
    else:
        skipped += 1
        print(f"  [EXISTS] {m['role']:8s} → {m['name']}")

# Add crew coordinators
for name in crew_names:
    obj, was_created = PlacementFamilyMember.objects.get_or_create(
        name=name,
        role="Crew",
        defaults={"hierarchy_level": 3},
    )
    if was_created:
        created += 1
        print(f"  [NEW]    Crew     → {name}")
    else:
        skipped += 1
        print(f"  [EXISTS] Crew     → {name}")

total = len(mentors) + len(crew_names)
print(f"\n✅  Done! {created} created, {skipped} already existed ({total} processed total).")
