from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication as BaseTokenAuthentication

from feeder import models


class KitchenPinAuthentication(BaseTokenAuthentication):
    keyword = 'K-PIN-CODE'

    def authenticate_credentials(self, key):

        try:
            kitchen = models.Kitchen.objects.get(pin_code=key)

            user = KitchenUser()
            user.id = kitchen.id
            user.first_name = kitchen.name

        except models.Kitchen.DoesNotExist:
            raise exceptions.AuthenticationFailed(_("Invalid token."))

        return user, key


class KitchenUser(AnonymousUser):

    username = ""
    first_name = ""
    last_name = ""

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    @property
    def is_kitchen(self):
        return True
