from rest_framework.response import Response
from rest_framework import permissions, viewsets, status

from .models import Activity, UserActivity
from .serializers import ReadUserActivitySerializer, ActivitySerializer, WriteUserActivitySerializer
from .utils import check_if_instance_exists
from authorization.models import SiteUser
from authorization.serializers import SiteUserSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        pass
    
    def retrieve(self, request, pk):
        return Response(data=f'{pk}')

    def destroy(self, request, pk):
        pass

class UserActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ReadUserActivitySerializer
    read_serializer = ReadUserActivitySerializer
    write_serializer = WriteUserActivitySerializer
    permission_classes = [permissions.AllowAny]

    @check_if_instance_exists(SiteUser, 'user_pk')
    def list(self, request, user_pk):
        user_activities = self.get_queryset()
        serializer = self.get_serializer_class()
        data = serializer(user_activities, many=True).data
        if request.user.pk != user_pk:
            for activity in data:
                self.hide_activity(activity, user_pk)
        return Response(data=data)

    @check_if_instance_exists(SiteUser, 'user_pk')
    def retrieve(self, request, user_pk, pk):
        serializer = self.get_serializer_class()
        user_activity = self.get_queryset(pk)
        if user_activity is None:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data='Activity doesn`t exist'
            )
        
        data = serializer(user_activity).data
        if request.user.pk != user_pk:
            self.hide_activity(data, user_pk)
        return Response(data=data)

    @check_if_instance_exists(SiteUser, 'user_pk')
    def create(self, request, user_pk):
        if request.user.pk != user_pk:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer_class()
        serializer_instance = serializer(data=request.data)
        if serializer_instance.is_valid():
            new_user_activity = serializer_instance.save()
            if new_user_activity:
                return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer_instance.errors)
    
    @check_if_instance_exists(SiteUser, 'user_pk')
    def destroy(self, request, user_pk, pk):
        self.get_serializer_class()
        if request.user.id != user_pk:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        response = super().destroy(request, user_pk, pk)
        return response
    
    # TODO:
    # @check_if_instance_exists(SiteUser, 'user_pk')
    # def update(self, request, user_pk, pk):
    #     pass
        

    def get_queryset(self, activity_pk=None):
        if self.queryset is None:
            if activity_pk:
                self.queryset = UserActivity.objects \
                    .filter(user__pk=self.kwargs['user_pk']) \
                    .filter(id=activity_pk) \
                    .first()
            else:
                self.queryset = UserActivity.objects.filter(user__pk=self.kwargs['user_pk'])
        return self.queryset
    
    def get_serializer_class(self):
        if self.serializer_class is None:
            if self.action in ['list', 'retrieve', 'destroy']:
                self.serializer_class = self.read_serializer
            if self.action in ['create']:
                self.serializer_class = self.write_serializer
        return self.serializer_class 
    
    @staticmethod
    def hide_activity(user_activity, user_pk):
        if not user_activity['is_visible']:
            user_activity['activity']['name'] = None
            user_activity['activity']['organizer'] = int(user_pk)
            user_activity['activity']['id'] = None
            user_activity['activity']['created'] = None


class UserViewSet(viewsets.ModelViewSet):
    queryset = SiteUser.objects.all()
    serializer_class = SiteUserSerializer
    permission_classes = [permissions.AllowAny]

    def destroy(self, request, pk):
        if request.user.id != pk:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        response = super().destroy(request, pk=pk)
        return response