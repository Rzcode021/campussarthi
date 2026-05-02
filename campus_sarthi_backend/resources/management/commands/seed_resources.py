from django.core.management.base import BaseCommand
from resources.models import Resource


class Command(BaseCommand):
    help = 'Seed resources'

    def handle(self, *args, **kwargs):
        resources_data = [
            {'title': 'LeetCode', 'category': 'DSA', 'difficulty': 'Intermediate', 'url': 'https://leetcode.com', 'description': 'Most popular coding interview platform with 2500+ problems used by top companies for hiring.'},
            {'title': "Striver's A2Z DSA Sheet", 'category': 'DSA', 'difficulty': 'Beginner', 'url': 'https://takeuforward.org', 'description': 'Comprehensive 450-problem sheet covering all DSA topics systematically. Best starting point for placements.'},
            {'title': 'GeeksForGeeks DSA', 'category': 'DSA', 'difficulty': 'Beginner', 'url': 'https://www.geeksforgeeks.org/data-structures/', 'description': 'Detailed articles and practice problems for every DSA topic with company-wise questions.'},
            {'title': 'NeetCode 150', 'category': 'DSA', 'difficulty': 'Intermediate', 'url': 'https://neetcode.io/practice', 'description': '150 must-solve LeetCode problems with video explanations covering all patterns for FAANG.'},
            {'title': 'CP Algorithms', 'category': 'DSA', 'difficulty': 'Advanced', 'url': 'https://cp-algorithms.com', 'description': 'Comprehensive reference for competitive programming algorithms with mathematical proofs.'},
            {'title': 'Python Official Docs', 'category': 'Python', 'difficulty': 'Beginner', 'url': 'https://docs.python.org/3/', 'description': 'The definitive reference for Python programming language covering all built-in functions.'},
            {'title': 'Real Python', 'category': 'Python', 'difficulty': 'Intermediate', 'url': 'https://realpython.com', 'description': 'High-quality Python tutorials covering web development, data science, and automation.'},
            {'title': 'Automate the Boring Stuff', 'category': 'Python', 'difficulty': 'Beginner', 'url': 'https://automatetheboringstuff.com', 'description': 'Practical Python for beginners. Learn to automate everyday tasks using Python scripts.'},
            {'title': 'Python Data Science Handbook', 'category': 'Python', 'difficulty': 'Intermediate', 'url': 'https://jakevdp.github.io/PythonDataScienceHandbook/', 'description': 'Covers NumPy, Pandas, Matplotlib, and Scikit-Learn. Essential for data science interviews.'},
            {'title': 'InterviewBit', 'category': 'Interview Prep', 'difficulty': 'Intermediate', 'url': 'https://www.interviewbit.com', 'description': 'Structured interview prep with company-specific problems and built-in mock interview feature.'},
            {'title': 'Pramp Mock Interviews', 'category': 'Interview Prep', 'difficulty': 'Intermediate', 'url': 'https://www.pramp.com', 'description': 'Free peer-to-peer mock technical interview platform with instant feedback.'},
            {'title': 'System Design Primer', 'category': 'Interview Prep', 'difficulty': 'Advanced', 'url': 'https://github.com/donnemartin/system-design-primer', 'description': 'Comprehensive open-source guide to system design interviews covering scalability and real-world systems.'},
            {'title': 'Glassdoor Interview Questions', 'category': 'Interview Prep', 'difficulty': 'Beginner', 'url': 'https://www.glassdoor.co.in/Interview/index.htm', 'description': 'Real interview questions submitted by candidates. Filter by company and role.'},
            {'title': 'AmbitionBox', 'category': 'Interview Prep', 'difficulty': 'Beginner', 'url': 'https://www.ambitionbox.com', 'description': 'Read real employee reviews and interview experiences for companies before your interview.'},
            {'title': 'IndiaBix Aptitude', 'category': 'Aptitude', 'difficulty': 'Beginner', 'url': 'https://www.indiabix.com', 'description': 'Comprehensive aptitude test prep with quantitative, logical reasoning, and verbal ability questions.'},
            {'title': 'PrepInsta', 'category': 'Aptitude', 'difficulty': 'Beginner', 'url': 'https://prepinsta.com', 'description': 'Company-specific aptitude prep with previous year papers for TCS, Infosys, Wipro and more.'},
            {'title': 'Career Power Aptitude', 'category': 'Aptitude', 'difficulty': 'Intermediate', 'url': 'https://www.careerpower.in', 'description': 'Daily aptitude practice sets with detailed solutions covering all topics.'},
        ]

        for data in resources_data:
            r, created = Resource.objects.get_or_create(title=data['title'], defaults={**data, 'is_active': True})
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created: {r.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'  Exists: {r.title}'))

        self.stdout.write(self.style.SUCCESS('Seed resources completed!'))
