from rest_framework import routers, serializers, viewsets

from feeder import models


class DepartmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Department
        fields = '__all__'


class VolunteerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Volunteer
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Location
        fields = '__all__'


class ColorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Color
        fields = '__all__'


class FeedTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.FeedType
        fields = '__all__'


class FeedTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.FeedTransaction
        fields = '__all__'

    def create(self, validated_data):
        # for i, a in validated_data.items():
        #     #print("-->", i, "/", a)
        #
        #return models.FeedTransaction.objects.bulk_create(validated_data, ignore_conflicts=True)
        pass


class KitchenSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Kitchen
        fields = ['id', 'name', 'comment']


class SyncStatisticItem(serializers.Serializer):
    created = serializers.IntegerField()
    total = serializers.IntegerField()


class SyncStatistic(serializers.Serializer):
    volunteers = SyncStatisticItem()
    departments = SyncStatisticItem()
    locations = SyncStatisticItem()


class SimpleResponse(serializers.Serializer):
    success = serializers.BooleanField()


class UserDetailSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    id = serializers.CharField()
    roles = serializers.SerializerMethodField()
    kitchen = KitchenSerializer(required=False)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def get_roles(self, user):
        if getattr(user, 'is_kitchen', None):
            return ["KITCHEN", ]
        if user.is_staff or user.is_superuser:
            return ["ADMIN", ]
