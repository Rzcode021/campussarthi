from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class CrewMember(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=200)
    bio = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.title}"


class CrewRating(models.Model):
    crew_member = models.ForeignKey(CrewMember, on_delete=models.CASCADE, related_name='ratings')
    rated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('crew_member', 'rated_by')


class PlacementFamilyMember(models.Model):
    ROLE_CHOICES = (
        ('Faculty', 'Faculty'),
        ('Mentor', 'Mentor'),
        ('Crew', 'Crew'),
        ('Lead', 'Lead'),
    )
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    image = models.ImageField(upload_to='campus_sarthi/placement_family/', blank=True, null=True)
    hierarchy_level = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['hierarchy_level', 'name']

    def __str__(self):
        return f"{self.name} - {self.role}"
