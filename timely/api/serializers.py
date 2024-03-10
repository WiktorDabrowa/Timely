from rest_framework import serializers
from .models import Activity, UserActivity

class WriteUserActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserActivity
        fields = '__all__'
        extra_kwargs = {
            "activity": {"required": True},
            "is_visible": {"required": True},
            "user": {"required": True},
        }

    def create(self, valdiated_data):
        instance = self.Meta.model(**valdiated_data)
        instance.save()
        return instance


class ReadUserActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = UserActivity
        exclude = ['user']
        depth = 1


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = '__all__'


    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return