from django.contrib import admin
from .models import UserActivity, Activity

admin.site.register(UserActivity)
admin.site.register(Activity)