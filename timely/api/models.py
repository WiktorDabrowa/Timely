from django.db import models
from authorization.models import SiteUser
from django.core.exceptions import ValidationError
# Create your models here.


class Activity(models.Model):
    name = models.CharField(max_length=256)
    created = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField() 
    end_time = models.DateTimeField()
    organizer = models.ForeignKey(SiteUser, on_delete=models.CASCADE, related_name='organizes')
    is_private = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} by {self.organizer}"
    
    def clean(self):
        # Validate proper timeline and remove seconds and microseconds from fields
        if self.start_time > self.end_time:
            raise ValidationError('Start time must be before end time')
        
        self.start_time = self.start_time.replace(second=0, microsecond=0)
        self.end_time = self.end_time.replace(second=0, microsecond=0)

class UserActivity(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE, related_name='activities')
    is_visible = models.BooleanField()

    def __str__(self):
        return f'{self.user} attends {self.activity.__str__()}'
