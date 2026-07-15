"""
One-shot seeder — run with:
    python seed_events.py
from inside campus_sarthi_backend/
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_sarthi.settings')
django.setup()

from events.models import Event  # noqa: E402

EVENTS = [
    {
        "title": "SAGAR SAMARTHYA",
        "category": "Placement Preparation",
        "short_description": "A comprehensive onboarding and career guidance program helping students become industry-ready professionals.",
        "description": (
            "SISTec organized Sagar Samarthya, a flagship career guidance initiative for Engineering students of "
            "Batch 2027, designed to bridge the gap between academic learning and industry excellence.\n\n"
            "Focus Areas:\n"
            "• Campus Placements\n"
            "• Global Education\n"
            "• Higher Education (GATE)\n"
            "• Entrepreneurship\n"
            "• Alumni Insights\n"
            "• Pod.ai Assessment"
        ),
    },
    {
        "title": "SAGAR SETU",
        "category": "Placement Preparation",
        "short_description": "Specific campus-based mock sessions designed to simulate real placement processes and improve student readiness.",
        "description": "",
    },
    {
        "title": "SAGAR MANTHAN",
        "category": "Placement Training",
        "short_description": "Placement-oriented training program focused on technical, aptitude, communication, and interview preparation.",
        "description": "",
    },
    {
        "title": "NUMBER GAMES",
        "category": "Aptitude Development",
        "short_description": "Numerical aptitude assessment and practice event aimed at strengthening quantitative reasoning and problem-solving skills.",
        "description": "",
    },
    {
        "title": "TEDx SISTec",
        "category": "Leadership & Inspiration",
        "short_description": "TEDx platform featuring inspiring speakers, innovators, entrepreneurs, and leaders sharing impactful ideas and experiences.",
        "description": "",
    },
    {
        "title": "HEADSTART 2.0",
        "category": "Engineering Career Development",
        "short_description": "Industry-focused career acceleration program for engineering students covering emerging technologies, placements, higher studies, and professional development.",
        "description": "Audience: B.Tech Students",
    },
    {
        "title": "HEADSTART – BUSINESS SCHOOL",
        "category": "Management & Business",
        "short_description": "A management-focused industry interaction forum preparing students for modern business careers.",
        "description": (
            "Audience: BBA / MBA Students\n\n"
            "Industry-Academia Forum providing insights into emerging management opportunities and future industry skills.\n\n"
            "Highlights:\n"
            "• Ethical Leadership in the Age of AI\n"
            "• ROI of Empathy\n"
            "• Industry interaction with leaders from:\n"
            "  – Ksema Fincorp\n"
            "  – Swiggy\n"
            "  – HCL\n"
            "  – Ernst & Young\n"
            "  – Hexaware Technologies"
        ),
    },
    {
        "title": "HEADSTART – SIPTec PHARMACY",
        "category": "Pharmacy & Healthcare",
        "short_description": "A career-focused pharmacy industry forum providing practical exposure, insights, and career guidance.",
        "description": (
            "Audience: Pharmacy Students\n\n"
            "Industry-academia forum connecting pharmacy students with pharmaceutical industry leaders and healthcare professionals.\n\n"
            "Highlights:\n"
            "• Keynote addresses\n"
            "• Panel discussions\n"
            "• Interactive Q&A sessions\n"
            "• Certified Pool Felicitation\n"
            "• Networking opportunities"
        ),
    },
    {
        "title": "SAGAR GLORY",
        "category": "Placement Achievement",
        "short_description": "Annual placement celebration honoring outstanding student achievements and career success.",
        "description": (
            "A grand celebration recognizing the placement achievements of SISTec students in the presence of "
            "Shri Mangubhai C. Patel, Hon'ble Governor of Madhya Pradesh."
        ),
    },
]

created = 0
skipped = 0
for evt in EVENTS:
    _, was_created = Event.objects.get_or_create(
        title=evt["title"],
        defaults={
            "category": evt["category"],
            "short_description": evt["short_description"],
            "description": evt["description"],
        },
    )
    if was_created:
        created += 1
        print(f"  ✓ Created: {evt['title']}")
    else:
        skipped += 1
        print(f"  – Skipped (already exists): {evt['title']}")

print(f"\nDone. {created} created, {skipped} skipped.")
