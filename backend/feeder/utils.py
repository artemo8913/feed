import arrow
import requests

from django.conf import settings
from django.db import transaction

from feeder import models


ZERO_HOUR = 4


@transaction.atomic
def sync_with_notion() -> dict:
    headers = {"Authorization": settings.NOTION_AUTH_HEADER}

    peoples_url = 'https://srv.rumyantsev.com/api/v1/agreemod/people'
    locations_url = 'https://srv.rumyantsev.com/api/v1/agreemod/locations'
    default_badge = models.Color.objects.filter(name='green').first()
    food_type_free = models.FeedType.objects.filter(code='FT1').first()
    food_type_paid = models.FeedType.objects.filter(code='FT2').first()
    statistic = {
        'volunteers': {'created': 0, 'total': 0},
        'departments': {'created': 0, 'total': 0},
        'locations': {'created': 0, 'total': 0},
    }

    # Locations
    r = requests.get(locations_url, headers=headers)
    if r.ok:
        names = set([i.get('name') for i in r.json()])
        for name in names:
            location, created = models.Location.objects.get_or_create(name=capitalize(name))
            if created:
                statistic['locations']['created'] += 1
        statistic['locations']['total'] = len(names)

    # with open("data/notion_locations.json", "w") as f:
    #     f.write(r.text)

    # Volunteers
    r = requests.get(peoples_url, headers=headers)
    if r.ok:
        items = r.json()
        #
        # with open("data/notion_volunteers.json", "w") as f:
        #     f.write(r.text)

        departments = set()
        # Prepare departments
        for item in items:
            if names := item.get('service_or_location'):
                departments |= set([capitalize(name) for name in names])

        statistic['departments']['total'] = len(departments)
        # Update departments
        for department_name in departments:
            department, created = models.Department.objects.get_or_create(
                name=department_name,
            )
            if created:
                statistic['departments']['created'] += 1

        statistic['volunteers']['total'] = len(items)
        for item in items:
            volunteer, created = models.Volunteer.objects.get_or_create(
                uuid=item.get('uuid')
            )
            if created:
                statistic['volunteers']['created'] += 1

            if not created and (volunteer.is_active or volunteer.is_blocked):
                print('skip, already activated {}'.format(volunteer.uuid))
                continue
            
            volunteer.name = item.get('name')
            volunteer.lastname = item.get('lastname')
            volunteer.nickname = item.get('nickname')
            volunteer.email = item.get('email')
            volunteer.qr = item.get('qr')
            volunteer.is_vegan = item.get('is_vegan')
            volunteer.position = item.get('position')
            volunteer.feed_type = food_type_free if item.get('food_type') == 'Бесплатно' else food_type_paid
            volunteer.balance = food_type_free.daily_amount if item.get('food_type') == 'Бесплатно' else food_type_paid.daily_amount
            volunteer.kitchen = models.Kitchen.objects.get(pk=1)

            if arrival_dt := item.get('arrival_date'):
                volunteer.arrival_date = arrow.get(arrival_dt).replace(hour=ZERO_HOUR).datetime
                volunteer.active_from = volunteer.arrival_date
            if depart_dt := item.get('departure_date'):
                volunteer.departure_date = arrow.get(depart_dt).replace(hour=ZERO_HOUR).datetime
                volunteer.active_to = volunteer.departure_date

            if color := item.get('color'):
                if badge_color := models.Color.objects.filter(name=color).first():
                    volunteer.color_type = badge_color
            if not volunteer.color_type:
                volunteer.color_type = default_badge

            if (department_names := item.get('service_or_location')) and len(department_names) > 0:
                volunteer.departments.set(
                    models.Department.objects.filter(name__in=[capitalize(name) for name in department_names]).all()
                )

            volunteer.save()

    return statistic


def capitalize(s: str) -> str:
    if s:
        return s[0].title()+s[1:]

