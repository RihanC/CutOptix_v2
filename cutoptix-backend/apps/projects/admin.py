from django.contrib import admin
from .models import Project, ProjectNote


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'client_name', 'status', 'total_cost', 'created_at']
    list_filter = ['status', 'created_at', 'deadline']
    search_fields = ['id', 'name', 'client_name']
    ordering = ['-created_at']


@admin.register(ProjectNote)
class ProjectNoteAdmin(admin.ModelAdmin):
    list_display = ['project', 'created_by', 'created_at']
    list_filter = ['created_at', 'project']
    search_fields = ['project__id', 'content']
