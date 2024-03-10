from django.urls import path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'activities', views.ActivityViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'users/(?P<user_pk>\d+)/activities', views.UserActivityViewSet, basename='user_activities')

# urlpatterns = [
#     path("users/<int:user_pk>/activities/<int:activity_id>", views.UserViewSet.activity_detail)
# ]

urlpatterns = router.urls