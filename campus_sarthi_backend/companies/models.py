import os
from django.db import models
from django.conf import settings


class Company(models.Model):
    DOMAIN_CHOICES = (('CS', 'CS'), ('Cyber', 'Cyber'), ('Product', 'Product'), ('Sales', 'Sales'))
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    )

    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='campus_sarthi/logos/', blank=True, null=True)
    domain = models.CharField(max_length=10, choices=DOMAIN_CHOICES)
    about = models.TextField()
    job_role = models.CharField(max_length=200)
    salary_lpa = models.DecimalField(max_digits=5, decimal_places=2)
    tech_requirements = models.JSONField(default=list)
    gd_questions = models.JSONField(default=list)
    interview_questions = models.JSONField(default=list)
    eligibility_criteria = models.TextField()
    bond_details = models.CharField(max_length=200)
    
    # New fields for wizard
    package_details = models.CharField(max_length=300, blank=True)
    service_bond = models.CharField(max_length=200, blank=True)
    selection_rounds = models.JSONField(default=list)
    joining_location = models.CharField(max_length=200, blank=True)
    tentative_date = models.CharField(max_length=100, blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='uploaded_companies'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_companies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Companies'


class CompanyDocument(models.Model):
    SECTION_CHOICES = [
        ('about', 'About'),
        ('gd_questions', 'GD Questions'),
        ('interview_questions', 'Interview Questions'),
        ('requirements', 'Requirements'),
        ('selection_process', 'Selection Process'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='documents')
    section = models.CharField(max_length=30, choices=SECTION_CHOICES)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=300, blank=True)
    file = models.FileField(upload_to='campus_sarthi/company_docs/')
    file_type = models.CharField(max_length=20, blank=True)
    file_size = models.CharField(max_length=20, blank=True)
    download_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.CharField(max_length=300, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='company_docs'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_docs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.company.name})"

    class Meta:
        ordering = ['-created_at']
