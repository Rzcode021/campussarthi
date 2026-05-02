from django.db import models
from django.conf import settings


class Bookmark(models.Model):
    TYPE_CHOICES = (('company', 'Company'), ('question', 'Question'))

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bookmark_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    object_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'bookmark_type', 'object_id')
