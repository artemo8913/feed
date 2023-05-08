from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import routers, serializers, viewsets
from rest_framework.views import APIView

from feeder import serializers
from feeder import models
from feeder.utils import sync_with_notion


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', ]


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = models.Volunteer.objects.all()
    serializer_class = serializers.VolunteerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'nickname', 'phone', 'email', 'qr']
    filterset_fields = ['name', 'nickname', 'phone', 'email', 'qr', 'departments', 'color_type', 'feed_type', 'kitchen']


class LocationViewSet(viewsets.ModelViewSet):
    queryset = models.Location.objects.all()
    serializer_class = serializers.LocationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', ]


class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', ]


@extend_schema(tags=['feed', ])
class FeedTypeViewSet(viewsets.ModelViewSet):
    queryset = models.FeedType.objects.all()
    serializer_class = serializers.FeedTypeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', ]


@extend_schema(tags=['feed', ])
class FeedTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.FeedTransaction.objects.all()
    serializer_class = serializers.FeedTransactionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['volunteer', ]


class KitchenViewSet(viewsets.ModelViewSet):
    queryset = models.Kitchen.objects.all()
    serializer_class = serializers.KitchenSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', ]


class SyncWithNotion(APIView):
    """
    Синхронизация Volunteer с Notion
    """

    @extend_schema(responses={200: serializers.SyncStatistic}, summary="Запуск синхронизации с Notion")
    def post(self, request):
        result = sync_with_notion()
        return Response(
            serializers.SyncStatistic(result).data
        )


@extend_schema(tags=['feed', ], summary="Массовое добавление приёмов пищи")
class FeedTransactionBulk(APIView):
    """
    Работа с массивом кормёжек
    """

    @extend_schema(
        request=serializers.FeedTransactionSerializer(many=True),
        responses={200: serializers.SimpleResponse},
    )
    def post(self, request):

        serializer = serializers.FeedTransactionSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializers.SimpleResponse({'success': True}).data
        )


class UpdateBalance(APIView):
    """
    """
    # permission_classes = [IsAuthenticated, ]

    def post(self, request):
        """
            vols = vols_by_date(query=Volunteer.query, active=True).all()

            for v in vols:
                if v.is_blocked:
                    continue

                if v.feed_type is None:
                    continue

                v.daily_eats = v.feed_type.daily_amount

                db.session.add(v)

            u = User.query.first()
            u.last_reset = datetime.datetime.now()
            db.session.add(u)

            db.session.commit()
        """


class Statistics(APIView):
    def get(self, request):
        return Response('tell me what you want as a result, please')
