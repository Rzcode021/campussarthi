from django.db import models
from django.conf import settings


class Resource(models.Model):
    CATEGORY_CHOICES = (
        ('DSA', 'DSA'),
        ('Python', 'Python'),
        ('Interview Prep', 'Interview Prep'),
        ('Aptitude', 'Aptitude'),
    )
    DIFFICULTY_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    url = models.URLField()
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    is_active = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
