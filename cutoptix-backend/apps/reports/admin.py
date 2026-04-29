from django.contrib import admin
from .models import Report, ReportTemplate


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'report_type', 'status', 'created_at', 'downloaded_count']
    list_filter = ['report_type', 'status', 'created_at']
    search_fields = ['id', 'project__id']
    ordering = ['-created_at']


@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'report_type', 'is_active', 'created_at']
    list_filter = ['report_type', 'is_active']
    search_fields = ['name']
