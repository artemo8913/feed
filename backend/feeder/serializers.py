from rest_framework import routers, serializers, viewsets

from feeder import models
from feeder.utils import StatisticType


class DepartmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Department
        fields = '__all__'

class DepartmentNestedSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Department
        fields = ['id', 'name']

class VolunteerListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    departments = DepartmentNestedSerializer(many=True)

    class Meta:
        model = models.Volunteer
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
        return models.FeedTransaction.objects.create(**validated_data)


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


class StatisticsRequestSerializer(serializers.Serializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()


class StatisticsResponseSerializer(serializers.Serializer):
    date = serializers.DateField()
    type = serializers.ChoiceField(choices=[type.value for type in StatisticType])
    is_vegan = serializers.BooleanField(allow_null=True)
    meal_time = serializers.CharField(max_length=10, validators=[models.validate_meal_time])
    amount = serializers.IntegerField(min_value=0)
    kitchen_id = serializers.IntegerField(allow_null=True)


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
