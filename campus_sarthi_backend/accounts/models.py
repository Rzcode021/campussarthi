from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('crew', 'Crew'),
        ('admin', 'Admin'),
    )
    BRANCH_CHOICES = (
        ('CS', 'Computer Science'),
        ('IT', 'Information Technology'),
        ('ENTC', 'Electronics & Telecom'),
        ('Mechanical', 'Mechanical'),
        ('Civil', 'Civil'),
        ('Other', 'Other'),
    )
    YEAR_CHOICES = ((1, 'First'), (2, 'Second'), (3, 'Third'), (4, 'Final'))

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_active = models.BooleanField(default=False)
    profile_photo = models.ImageField(upload_to='campus_sarthi/profiles/', blank=True, null=True)
    branch = models.CharField(max_length=20, choices=BRANCH_CHOICES, blank=True)
    year = models.IntegerField(choices=YEAR_CHOICES, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        if self.role == 'admin':
            self.is_staff = True
            self.is_active = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.email})"
