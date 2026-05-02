import os
from django.db import models
from django.conf import settings


class StudyMaterial(models.Model):
    CATEGORY_CHOICES = (
        ('Aptitude', 'Aptitude'),
        ('Technical', 'Technical'),
        ('HR Interview', 'HR Interview'),
        ('GD Preparation', 'GD Preparation'),
        ('Resume', 'Resume'),
        ('Domain Specific', 'Domain Specific'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    file = models.FileField(upload_to='campus_sarthi/study_materials/')
    file_size = models.CharField(max_length=20, blank=True)
    file_type = models.CharField(max_length=10, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='uploaded_materials'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_materials'
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
