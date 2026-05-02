from django.db import models
from django.conf import settings


class NewsArticle(models.Model):
    TAG_CHOICES = (
        ('Tech', 'Tech'),
        ('Placements', 'Placements'),
        ('Industry', 'Industry'),
        ('Campus', 'Campus'),
    )

    title = models.CharField(max_length=300)
    description = models.TextField()
    tag = models.CharField(max_length=15, choices=TAG_CHOICES)
    source = models.CharField(max_length=200)
    url = models.URLField(blank=True)
    is_published = models.BooleanField(default=False)
    published_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    published_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.is_published and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-published_at']
