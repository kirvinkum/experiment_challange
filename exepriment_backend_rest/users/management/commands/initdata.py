from django.core.management import BaseCommand, call_command
from users.models import User

class Command(BaseCommand):
    help = "DEV COMMAND: To load and encrypt user password."
    def handle(self, *args, **options):
        call_command('loaddata','user_data.json')
        #encrypt password for loaded data
        for user in User.objects.all():
            user.set_password(user.password)
            user.save()