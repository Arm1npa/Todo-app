from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('tasks/', task_list, name='task_list'),
    path('tasks/create/', create_task, name='create_task'),
    path('tasks/update/<int:pk>/', update_task, name='update_task'),
    path('tasks/delete/<int:pk>/', delete_task, name='delete_tasks'),
]
