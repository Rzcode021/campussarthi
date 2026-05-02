from django.core.management.base import BaseCommand
from accounts.models import CustomUser
from companies.models import Company


class Command(BaseCommand):
    help = 'Seed the database with sample companies'

    def handle(self, *args, **kwargs):
        admin, created = CustomUser.objects.get_or_create(
            email='admin@campussarthi.com',
            defaults={
                'full_name': 'Placement Admin',
                'role': 'admin',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin user created: admin@campussarthi.com / admin123'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))

        companies_data = [
            {
                'name': 'TCS', 'domain': 'CS', 'job_role': 'Software Engineer', 'salary_lpa': 3.50,
                'about': 'Tata Consultancy Services (TCS) is India\'s largest IT services company with a presence in 46 countries. Known for its strong training programs and large-scale enterprise projects.',
                'tech_requirements': ['Python', 'Java', 'SQL', 'Data Structures', 'OOPS'],
                'gd_questions': [
                    'Is Artificial Intelligence a threat to human employment?',
                    'Digital India: Vision vs Reality',
                    'Work from Home vs Work from Office',
                    'Should social media be regulated by the government?',
                    'Electric vehicles — Are we ready for the transition?',
                ],
                'interview_questions': [
                    'Explain the four pillars of Object-Oriented Programming.',
                    'What is the difference between a stack and a queue?',
                    'Write a program to reverse a string without using built-in methods.',
                    'What is normalization in DBMS? Explain 1NF, 2NF, 3NF.',
                    'Explain the difference between TCP and UDP protocols.',
                    'What is polymorphism? Give a real-world example.',
                    'How does a hash map work internally?',
                    'Where do you see yourself in 5 years?',
                ],
                'eligibility_criteria': '60% aggregate in 10th, 12th, and graduation. No active backlogs.',
                'bond_details': '1 year training bond',
            },
            {
                'name': 'Infosys', 'domain': 'CS', 'job_role': 'Systems Engineer', 'salary_lpa': 3.60,
                'about': 'Infosys is a global leader in next-generation digital services and consulting. They enable clients in 50+ countries to navigate their digital transformation.',
                'tech_requirements': ['Java', '.NET', 'Agile', 'SQL', 'Communication Skills'],
                'gd_questions': [
                    'Is AI the fourth industrial revolution?',
                    'Privatization of public sector banks — pros and cons',
                    'Online education vs Traditional classroom education',
                    'Should cryptocurrency be legalized in India?',
                    'The role of technology in solving climate change',
                ],
                'interview_questions': [
                    'What is a linked list? Explain with types.',
                    'Difference between primary key and unique key.',
                    'Explain Agile methodology and its principles.',
                    'Write a program to find the factorial of a number recursively.',
                    'What is the difference between abstract class and interface?',
                    'Explain the SOLID principles.',
                    'What is cloud computing? Name 3 cloud providers.',
                    'Why do you want to join Infosys?',
                ],
                'eligibility_criteria': '65% in 10th and 12th, minimum 6.5 CGPA in graduation. No backlogs.',
                'bond_details': 'No bond',
            },
            {
                'name': 'Wipro', 'domain': 'CS', 'job_role': 'Project Engineer', 'salary_lpa': 3.50,
                'about': 'Wipro Limited is a leading global information technology, consulting and business process services company. They harness the power of cognitive computing and hyper-automation.',
                'tech_requirements': ['Python', 'Java', 'REST APIs', 'MySQL', 'Linux'],
                'gd_questions': [
                    'Cashless India — Dream or Reality?',
                    'Impact of social media on mental health of youth',
                    'Should India ban single-use plastics?',
                    'Women empowerment in corporate India',
                    'Is technology making us less social?',
                ],
                'interview_questions': [
                    'Explain the OSI model and its 7 layers.',
                    'What is a deadlock in OS? How is it prevented?',
                    'Write an SQL query to find the second highest salary.',
                    'Explain the concept of multithreading.',
                    'What is the difference between C and C++?',
                    'Explain SDLC and its phases.',
                    'What is an API? How does REST differ from SOAP?',
                    'Are you willing to relocate? Why should we hire you?',
                ],
                'eligibility_criteria': '60% throughout academics. Maximum 3-year education gap allowed.',
                'bond_details': '15 months service bond',
            },
            {
                'name': 'Quick Heal', 'domain': 'Cyber', 'job_role': 'Security Analyst', 'salary_lpa': 5.00,
                'about': 'Quick Heal Technologies is a leading IT security solutions company. They develop security software for consumers, small businesses, government, and enterprises.',
                'tech_requirements': ['Network Security', 'Python', 'SIEM', 'Ethical Hacking', 'Linux'],
                'gd_questions': [
                    'Data privacy in the age of social media',
                    'Is India prepared for large-scale cyber attacks?',
                    'Ethical hacking — necessary evil or necessary good?',
                    'Zero-day vulnerabilities — who bears responsibility?',
                    'The role of AI in modern cybersecurity',
                ],
                'interview_questions': [
                    'What is the CIA triad in cybersecurity?',
                    'Explain the difference between symmetric and asymmetric encryption.',
                    'What is SQL injection? How do you prevent it?',
                    'How does a firewall work? Types of firewalls?',
                    'What is XSS (Cross-Site Scripting)? How to prevent it?',
                    'Explain the incident response lifecycle.',
                    'What is a VPN and how does it work?',
                    'Describe a recent cybersecurity breach you read about.',
                ],
                'eligibility_criteria': 'BE/B.Tech in CS/IT/Cybersecurity. No standing backlogs.',
                'bond_details': '2 years service bond',
            },
            {
                'name': 'IBM Security', 'domain': 'Cyber', 'job_role': 'Cybersecurity Associate', 'salary_lpa': 7.50,
                'about': 'IBM Security offers one of the most advanced and integrated portfolios of enterprise security products and services. IBM Security helps organizations reduce risk.',
                'tech_requirements': ['CISSP', 'SIEM', 'Threat Analysis', 'Cloud Security', 'Python'],
                'gd_questions': [
                    'Cloud security — shared responsibility model',
                    'Is data the new oil? Who should own it?',
                    'The impact of GDPR on global businesses',
                    'Biometrics vs passwords — which is safer?',
                    'Nation-state cyber warfare — a growing threat',
                ],
                'interview_questions': [
                    'What is a SIEM system? Name two popular SIEM tools.',
                    'Explain the steps to handle a data breach.',
                    'What is penetration testing vs vulnerability assessment?',
                    'Explain threat hunting and its methodology.',
                    'What is IAM (Identity and Access Management)?',
                    'How do you assess third-party vendor risk?',
                    'Explain the concept of Zero Trust Architecture.',
                    'What security certifications are you targeting?',
                ],
                'eligibility_criteria': '65% aggregate. Relevant certifications (CEH, Security+) preferred.',
                'bond_details': '1 year',
            },
            {
                'name': 'Palo Alto Networks', 'domain': 'Cyber', 'job_role': 'Security Engineer', 'salary_lpa': 9.00,
                'about': 'Palo Alto Networks is a global cybersecurity leader that is transforming the cloud-centric future with technology that is transforming the way people and organizations operate.',
                'tech_requirements': ['Firewalls', 'Zero Trust', 'Python', 'PCNSE', 'Cloud Security'],
                'gd_questions': [
                    'Zero Trust — the future of enterprise security?',
                    'Future of remote work security challenges',
                    'Ransomware as a service — the new threat landscape',
                    'AI in cyber offense vs defense',
                    'Balancing user experience with security',
                ],
                'interview_questions': [
                    'How does a Next-Generation Firewall differ from a traditional firewall?',
                    'Explain the TCP three-way handshake.',
                    'What is BGP and why is it important?',
                    'How do you mitigate a DDoS attack?',
                    'Explain IPSec and its two modes.',
                    'What is SD-WAN?',
                    'Troubleshoot: User cannot access the internet after policy change.',
                    'How do you stay updated with the latest security threats?',
                ],
                'eligibility_criteria': '70% and above. Strong networking fundamentals required.',
                'bond_details': 'No bond',
            },
            {
                'name': 'Persistent Systems', 'domain': 'Product', 'job_role': 'Associate Engineer', 'salary_lpa': 5.50,
                'about': 'Persistent Systems is a global solutions company delivering digital business acceleration, enterprise modernization, and digital product engineering.',
                'tech_requirements': ['React', 'Node.js', 'Agile', 'REST APIs', 'PostgreSQL'],
                'gd_questions': [
                    'Product-based vs service-based companies — which is better?',
                    'Impact of 5G on software development',
                    'Startups vs MNCs — where should fresh graduates go?',
                    'Future of IoT in Indian households',
                    'Agile vs Waterfall — which methodology wins?',
                ],
                'interview_questions': [
                    'Design a URL shortener like bit.ly.',
                    'Explain microservices architecture vs monolith.',
                    'Write a program to detect a cycle in a linked list.',
                    'What is the difference between SQL and NoSQL databases?',
                    'Explain the CAP theorem with examples.',
                    'What is Docker and why is it used?',
                    'How do you optimize a slow-running SQL query?',
                    'Tell me about a complex bug you fixed.',
                ],
                'eligibility_criteria': '60% throughout. Good problem-solving and communication skills.',
                'bond_details': 'No bond',
            },
            {
                'name': 'KPIT Technologies', 'domain': 'Product', 'job_role': 'Software Engineer', 'salary_lpa': 6.00,
                'about': 'KPIT Technologies is a global technology company focused on mobility. They are at the forefront of automotive software, working with leading OEMs and Tier-1 suppliers.',
                'tech_requirements': ['Embedded C', 'AUTOSAR', 'CAN Protocol', 'Python', 'RTOS'],
                'gd_questions': [
                    'Future of autonomous vehicles in India',
                    'Electric vehicles — infrastructure challenges',
                    'Make in India — success or failure?',
                    'Impact of AI on the automobile industry',
                    'Public transport vs private transport',
                ],
                'interview_questions': [
                    'What is an RTOS and why is it used in automotive?',
                    'Explain the CAN bus protocol.',
                    'Difference between microprocessor and microcontroller.',
                    'Write a C program to manipulate bits in a register.',
                    'Explain pointers and pointer arithmetic in C.',
                    'What are volatile variables and when are they used?',
                    'Explain interrupt service routines (ISR).',
                    'Why do you want to work in the automotive domain?',
                ],
                'eligibility_criteria': '65% in engineering. Branches: CS, IT, E&TC preferred.',
                'bond_details': '2 years',
            },
            {
                'name': 'Cyient', 'domain': 'Product', 'job_role': 'Associate Engineer', 'salary_lpa': 4.50,
                'about': 'Cyient is a global engineering, manufacturing, data analytics, and networks & operations company. They deliver technology solutions for aerospace, defense, medical, and telecommunications.',
                'tech_requirements': ['Python', 'Data Analysis', 'CAD', 'Communication', 'Engineering Design'],
                'gd_questions': [
                    'Role of engineers in nation-building',
                    'Sustainability in engineering design',
                    'Commercial space exploration — opportunity or risk?',
                    'Smart cities — the future of urban living',
                    'Renewable energy adoption in India',
                ],
                'interview_questions': [
                    'Explain your final year project in detail.',
                    'What is finite element analysis?',
                    'How do you approach a design problem with multiple constraints?',
                    'Explain geometric dimensioning and tolerancing.',
                    'Which CAD or simulation tools are you proficient in?',
                    'How do you ensure quality in engineering designs?',
                    'Describe a time you worked as part of a team on a technical project.',
                    'Why Cyient?',
                ],
                'eligibility_criteria': '60% throughout. CS, IT, Mechanical, E&TC branches.',
                'bond_details': '1 year',
            },
            {
                'name': 'Zoho Corporation', 'domain': 'Sales', 'job_role': 'Technical Sales Executive', 'salary_lpa': 4.00,
                'about': 'Zoho Corporation builds remarkably simple, elegant business software used by over 90 million users worldwide. They are proudly bootstrapped and employee-focused.',
                'tech_requirements': ['CRM', 'Communication', 'Product Demo', 'SQL', 'Business Analytics'],
                'gd_questions': [
                    'Bootstrapping vs venture capital funding',
                    'SaaS products — the future of enterprise software',
                    'Importance of localized products for Indian SMBs',
                    'Remote selling — challenges and opportunities',
                    'Customer feedback — underrated business asset',
                ],
                'interview_questions': [
                    'How would you approach a cold call to a potential client?',
                    'Explain the difference between marketing and sales.',
                    'How do you handle an angry or dissatisfied customer?',
                    'What is a CRM and how does it benefit a sales team?',
                    'Describe your strategies for consistently meeting targets.',
                    'How do you build rapport with a new prospect?',
                    'What do you know about Zoho\'s product suite?',
                    'Sell me this product in 60 seconds.',
                ],
                'eligibility_criteria': 'Any graduate. Passion for technology and sales. Excellent communication.',
                'bond_details': 'No bond',
            },
            {
                'name': 'Salesforce India', 'domain': 'Sales', 'job_role': 'Sales Development Representative', 'salary_lpa': 6.00,
                'about': 'Salesforce is the world\'s #1 CRM platform, helping companies connect with customers in a whole new way. They are pioneers of cloud computing and social enterprise.',
                'tech_requirements': ['Salesforce Platform', 'CRM', 'Communication', 'Lead Generation', 'Data Analysis'],
                'gd_questions': [
                    'B2B vs B2C sales — which is more challenging?',
                    'The death of cold calling — fact or fiction?',
                    'Impact of AI on the future of sales',
                    'Importance of customer retention over acquisition',
                    'Selling a solution vs selling a product',
                ],
                'interview_questions': [
                    'What is Salesforce? Name 5 Salesforce products.',
                    'How do you qualify a lead using BANT framework?',
                    'Describe a time you successfully persuaded someone.',
                    'What is a sales funnel? Walk me through the stages.',
                    'How do you manage your time across multiple prospects?',
                    'Why do you want to work in tech sales?',
                    'What is your greatest professional achievement so far?',
                    'How do you handle repeated rejection in sales?',
                ],
                'eligibility_criteria': 'Any graduate. Outstanding communication and interpersonal skills.',
                'bond_details': 'No bond',
            },
        ]

        for data in companies_data:
            company, created = Company.objects.get_or_create(
                name=data['name'],
                defaults={
                    **data,
                    'status': 'approved',
                    'uploaded_by': admin,
                    'approved_by': admin,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created: {company.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'  Exists: {company.name}'))

        self.stdout.write(self.style.SUCCESS('\nSeed companies completed!'))
