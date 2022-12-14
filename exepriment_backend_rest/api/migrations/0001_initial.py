# Generated by Django 4.0 on 2022-11-09 13:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Compound',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ic50', models.FloatField(default=None)),
            ],
        ),
        migrations.CreateModel(
            name='Experiment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default=None, max_length=20)),
                ('created_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=200, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('concentration', models.FloatField(default=None)),
                ('inhibition', models.FloatField(default=None)),
                ('compound', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.compound')),
                ('experiment', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.experiment')),
            ],
        ),
        migrations.AddField(
            model_name='compound',
            name='label',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.label'),
        ),
    ]
