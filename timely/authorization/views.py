from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SiteUserSerializer


class UserCreate(APIView):
    permission_classes = [permissions.AllowAny]


    def post(self, request):
            serializer = SiteUserSerializer(data=request.data)
            if serializer.is_valid():
                new_user = serializer.save()
                if new_user:
                     return Response(status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)
    