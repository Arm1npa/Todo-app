# Generated by Django 5.0.6 on 2024-05-16 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Note_api', '0003_alter_note_options_rename_created_note_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='text',
        ),
    ]