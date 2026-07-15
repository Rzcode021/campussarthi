from django.db import models


class Event(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=200, blank=True, default='')
    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True, default='')
    date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class EventImage(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='campus_sarthi/events/')

    def __str__(self):
        return f"Image for {self.event.title}"
