from django.db import models
from django.conf import settings


class Resource(models.Model):
    CATEGORY_CHOICES = (
        ('CSE', 'Computer Science Engineering'),
        ('CyberSecurity', 'Cyber Security'),
        ('AI_ML', 'Artificial Intelligence & Machine Learning'),
        ('DataScience', 'Data Science'),
        ('IT', 'Information Technology'),
        ('ECE', 'Electronics & Communication Engineering'),
        ('EE', 'Electrical Engineering'),
        ('Mechanical', 'Mechanical Engineering'),
        ('Civil', 'Civil Engineering'),
        ('MBA', 'MBA / Management'),
        ('Pharmacy', 'Pharmacy'),
        ('Aptitude', 'Aptitude Preparation'),
        ('Communication', 'Communication Skills'),
        ('Placement', 'Placement Preparation'),
        ('HigherStudies', 'Higher Studies (GATE/GRE/CAT)'),
    )
    DIFFICULTY_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )
    RESOURCE_TYPE_CHOICES = (
        ('PDF', 'PDF'),
        ('Video', 'Video'),
        ('Notes', 'Notes'),
        ('Practice Set', 'Practice Set'),
        ('Roadmap', 'Roadmap'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    url = models.URLField()
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    tags = models.CharField(max_length=300, blank=True, default='')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES, default='Notes')
    is_active = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
