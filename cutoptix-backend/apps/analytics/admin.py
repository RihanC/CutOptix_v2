from django.contrib import admin
from .models import ProjectAnalytics, DailyMetrics, MonthlyMetrics


@admin.register(ProjectAnalytics)
class ProjectAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['project', 'total_revenue', 'material_efficiency', 'updated_at']
    list_filter = ['updated_at']
    search_fields = ['project__id']


@admin.register(DailyMetrics)
class DailyMetricsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_projects', 'completed_projects', 'total_revenue']
    list_filter = ['date']
    ordering = ['-date']


@admin.register(MonthlyMetrics)
class MonthlyMetricsAdmin(admin.ModelAdmin):
    list_display = ['year', 'month', 'completed_projects', 'total_revenue']
    list_filter = ['year', 'month']
    ordering = ['-year', '-month']
