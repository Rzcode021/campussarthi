"""
Updates hierarchy_level for PlacementFamilyMember Crew entries to create
a proper pyramid tree structure:

  Level 3  (6 members)  – Senior Coordinators
  Level 4  (12 members) – Core Coordinators
  Level 5  (18 members) – Junior Coordinators

Run from campus_sarthi_backend:
    python seed_crew_hierarchy.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from crew.models import PlacementFamilyMember

# All 36 Placement Coordinator crew members (alphabetical)
# Arranged in 3 tiers:
#   Tier 1 (level 3) – 6 senior  → displayed on row just below Lead
#   Tier 2 (level 4) – 12 core   → middle row
#   Tier 3 (level 5) – 18 junior → bottom / widest row

TIER_1 = [  # 6 members – level 3
    "Aaliya Khan",
    "Abhinandan Singh",
    "Devansh Mishra",
    "Karan Rathore",
    "Saksham Sharma",
    "Suyash Rajpurohit",
]

TIER_2 = [  # 12 members – level 4
    "Aarti Keswani",
    "Abhishek Kheechi",
    "Abu Fahad",
    "Adyasha Pattanaik",
    "Anjali Lodhi",
    "Archana Mehra",
    "Arpana Chaubey",
    "Arsh Ahmed",
    "Hari Shankar Prajapati",
    "Hiba Nazir",
    "Kahkasha Begum",
    "Kritika Tekchandani",
]

TIER_3 = [  # 18 members – level 5
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
    "Sakshi Pawar",
    "Satish Rana",
    "Shahroz Khan",
    "Shiva Soni",
    "Sudhanshu Saw",
    "Ved Yadav",
]

updated = 0
not_found = []

def set_level(names, level):
    global updated
    for name in names:
        qs = PlacementFamilyMember.objects.filter(name=name, role='Crew')
        if qs.exists():
            qs.update(hierarchy_level=level)
            updated += 1
            print(f"  [OK] level {level} → {name}")
        else:
            not_found.append(name)
            print(f"  [MISSING] {name}")

print("\n── Tier 1 (level 3) ──────────────────────────────")
set_level(TIER_1, 3)

print("\n── Tier 2 (level 4) ──────────────────────────────")
set_level(TIER_2, 4)

print("\n── Tier 3 (level 5) ──────────────────────────────")
set_level(TIER_3, 5)

print(f"\n✅  Updated {updated} records.")
if not_found:
    print(f"⚠️   Not found: {not_found}")
