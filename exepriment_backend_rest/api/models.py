from django.db import models

class Label(models.Model):
    label = models.CharField(max_length=200, unique=True)
    def __str__(self):
        return self.label


class Compound(models.Model):
    label = models.ForeignKey(Label, on_delete=models.CASCADE, blank=False, null=False)
    ic50 = models.FloatField(null=False, blank=False, default=None)
    def __str__(self):
        return self.label


class Experiment(models.Model):
    name = models.CharField(max_length=20, default=None)
    created_at = models.DateTimeField(auto_now=True, blank=False)
    def __str__(self):
        return self.name


class Data(models.Model):
    concentration = models.FloatField(null=False, blank=False, default=None)
    inhibition = models.FloatField(null=False, blank=False, default=None)
    compound = models.ForeignKey(Compound, on_delete=models.CASCADE, blank=False, null=False, default=None)
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, blank=False, null=False, default=None)
    def __str__(self):
        return self.inhibition

