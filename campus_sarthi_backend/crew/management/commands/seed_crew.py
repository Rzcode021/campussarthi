from django.core.management.base import BaseCommand
from accounts.models import CustomUser
from crew.models import CrewMember


class Command(BaseCommand):
    help = 'Seed the database with sample crew members'

    def handle(self, *args, **kwargs):
        crew_data = [
            {
                'email': 'rahul.sharma@crew.com', 'full_name': 'Rahul Sharma',
                'title': 'Head Placement Coordinator', 'department': 'Computer Science',
                'bio': 'Final year CS student with experience coordinating 3 placement seasons. Personally helped 40+ students crack their dream companies through mock interviews and guidance sessions.',
            },
            {
                'email': 'priya.desai@crew.com', 'full_name': 'Priya Desai',
                'title': 'Resume & Aptitude Lead', 'department': 'Information Technology',
                'bio': 'IT student passionate about helping peers craft compelling resumes. Conducted 15+ resume review workshops and created the college aptitude question bank used by 300+ students.',
            },
            {
                'email': 'amit.joshi@crew.com', 'full_name': 'Amit Joshi',
                'title': 'Technical Interview Mentor', 'department': 'Computer Science',
                'bio': 'DSA enthusiast who has solved 500+ LeetCode problems. Runs weekly coding sessions and has mentored 25 students who secured positions at top product companies.',
            },
            {
                'email': 'sneha.patil@crew.com', 'full_name': 'Sneha Patil',
                'title': 'Company Relations Coordinator', 'department': 'Electronics & Telecom',
                'bio': 'Manages communication between companies and the college placement cell. Instrumental in onboarding 8 new companies to the campus placement program this year.',
            },
            {
                'email': 'rohan.mehta@crew.com', 'full_name': 'Rohan Mehta',
                'title': 'GD & Soft Skills Trainer', 'department': 'Information Technology',
                'bio': 'Former debate champion turned placement crew volunteer. Conducts weekly GD practice sessions covering current affairs, technology trends, and business topics.',
            },
            {
                'email': 'ananya.kumar@crew.com', 'full_name': 'Ananya Kumar',
                'title': 'Cybersecurity Domain Expert', 'department': 'Computer Science',
                'bio': 'CEH-certified student specializing in cybersecurity placements. Provides domain-specific interview coaching for security analyst and ethical hacking roles.',
            },
        ]

        for data in crew_data:
            user, user_created = CustomUser.objects.get_or_create(
                email=data['email'],
                defaults={
                    'full_name': data['full_name'],
                    'role': 'crew',
                    'is_active': True,
                    'branch': 'CS',
                    'year': 4,
                }
            )
            if user_created:
                user.set_password('crew@123')
                user.save()

            crew, crew_created = CrewMember.objects.get_or_create(
                user=user,
                defaults={
                    'title': data['title'],
                    'department': data['department'],
                    'bio': data['bio'],
                    'is_active': True,
                }
            )
            if crew_created:
                self.stdout.write(self.style.SUCCESS(f'  Created crew: {user.full_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'  Exists: {user.full_name}'))

        self.stdout.write(self.style.SUCCESS('\nSeed crew completed!'))
