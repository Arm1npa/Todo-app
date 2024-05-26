from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'user', 'title',
                  'completed', 'created_at', 'updated_at']
        read_only_fields = ['user']

        def get_total_tasks():
            return Task.get_total_tasks()

        def get_total_completed_tasks():
            return Task.get_total_completed_tasks()
