from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Employee(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    phone_number = models.IntegerField(max_length=15)
    added_by = models.ForeignKey(User, related_name='employees_added', on_delete=models.SET_NULL, null=True)
    modified_by = models.ForeignKey(User, related_name='employees_modified', on_delete=models.SET_NULL, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

