from django.core.management.base import BaseCommand
from news.models import NewsArticle


class Command(BaseCommand):
    help = 'Seed news articles'

    def handle(self, *args, **kwargs):
        articles = [
            {'title': 'TCS to Hire 40,000 Freshers This Year', 'tag': 'Placements', 'source': 'Economic Times',
             'url': 'https://economictimes.indiatimes.com', 'is_published': True,
             'description': 'Tata Consultancy Services has announced plans to hire 40,000 fresh graduates in FY2025, signaling strong recovery in IT hiring. The company will focus on engineering and MCA graduates with strong coding fundamentals.'},
            {'title': 'AI Skills Now Top Requirement for Campus Recruits', 'tag': 'Tech', 'source': 'Times of India',
             'url': 'https://timesofindia.com', 'is_published': True,
             'description': 'A new survey reveals that 78% of top tech companies now require at least basic AI/ML knowledge from campus recruits. Companies like Google, Microsoft, and Infosys are redesigning their hiring assessments to include AI literacy tests.'},
            {'title': 'Campus Placement Season 2025 Opens Next Month', 'tag': 'Campus', 'source': 'Campus Sarthi',
             'url': '', 'is_published': True,
             'description': 'The official campus placement season for the 2025 batch begins next month. All eligible students must complete their profile on the placement portal and submit their updated resumes to the placement cell by the end of this week.'},
            {'title': 'Wipro Launches Special Hiring Drive for CS Students', 'tag': 'Placements', 'source': 'Hindustan Times',
             'url': 'https://hindustantimes.com', 'is_published': True,
             'description': 'Wipro has announced a special recruitment drive targeting Computer Science and IT students from Tier-2 engineering colleges. The drive will include an online coding test followed by two technical interviews and an HR round.'},
            {'title': 'How to Prepare for TCS NQT 2025', 'tag': 'Tech', 'source': 'GeeksForGeeks',
             'url': 'https://geeksforgeeks.org', 'is_published': True,
             'description': 'TCS National Qualifier Test (NQT) is the gateway to TCS placements. This comprehensive guide covers the test pattern, important topics, recommended resources, and time management strategies to score in the top percentile.'},
            {'title': 'Cybersecurity Job Market Booms: 3.5 Million Openings Globally', 'tag': 'Industry', 'source': 'Forbes',
             'url': 'https://forbes.com', 'is_published': True,
             'description': 'The global cybersecurity workforce gap has reached 3.5 million unfilled positions. Indian cybersecurity professionals are increasingly sought after, with salaries jumping 25% year-over-year for certified ethical hackers and security analysts.'},
            {'title': 'Mock Interview Sessions This Saturday', 'tag': 'Campus', 'source': 'Campus Sarthi',
             'url': '', 'is_published': True,
             'description': 'The placement cell is organizing mock interview sessions this Saturday from 10 AM to 4 PM. Students will face real interview panels comprising faculty and industry volunteers. Slots are limited — register at the placement office by Thursday.'},
            {'title': 'Infosys Increases Fresher Salary to 4.5 LPA', 'tag': 'Placements', 'source': 'NDTV Profit',
             'url': 'https://ndtvprofit.com', 'is_published': True,
             'description': 'Infosys has revised its fresher compensation package upward to ₹4.5 LPA for System Engineer roles and ₹6.5 LPA for Specialist Programmer roles. This comes after competitive pressure from Wipro and Accenture also hiking fresher packages.'},
            {'title': 'The Rise of Product-Based Companies on Campus', 'tag': 'Industry', 'source': 'Business Standard',
             'url': 'https://business-standard.com', 'is_published': True,
             'description': 'An analysis of 2024 campus placement data shows a 40% increase in product-based companies visiting engineering campuses. Companies like Zoho, Persistent Systems, and KPIT are actively expanding their campus hiring programs.'},
            {'title': 'Resume Writing Workshop This Weekend', 'tag': 'Campus', 'source': 'Campus Sarthi',
             'url': '', 'is_published': True,
             'description': 'Join the placement crew for a hands-on resume writing workshop this Sunday. The session covers ATS-friendly formatting, action verbs, quantifying achievements, and tailoring your resume for different company types. Open to all students.'},
        ]

        for data in articles:
            a, created = NewsArticle.objects.get_or_create(title=data['title'], defaults=data)
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created: {a.title[:50]}'))
            else:
                self.stdout.write(self.style.WARNING(f'  Exists: {a.title[:50]}'))

        self.stdout.write(self.style.SUCCESS('Seed news completed!'))
