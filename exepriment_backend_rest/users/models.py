from django.db import models
from django.contrib.auth.models import AbstractUser

'''
Extended dajango's user table
'''
class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True,  db_index=True)
    password = models.CharField(max_length=255)


    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username