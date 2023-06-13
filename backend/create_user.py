### content of "create_user.py" file
from django.contrib.auth import get_user_model

# see ref. below
UserModel = get_user_model()

if not UserModel.objects.filter(username='admin').exists():
    user=UserModel.objects.create_user('admin', password='Kolombina25')
    user.is_superuser=True
    user.is_staff=True
    user.save()
