from rest_framework import serializers
from .models import ProjectAnalytics, DailyMetrics, MonthlyMetrics


class ProjectAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for ProjectAnalytics"""
    
    class Meta:
        model = ProjectAnalytics
        fields = [
            'id', 'project', 'total_revenue', 'average_project_cost', 'cost_variance',
            'material_efficiency', 'waste_reduction_percentage', 'estimated_completion_date',
            'actual_completion_date', 'time_variance', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class DailyMetricsSerializer(serializers.ModelSerializer):
    """Serializer for DailyMetrics"""
    
    class Meta:
        model = DailyMetrics
        fields = [
            'id', 'date', 'total_projects', 'completed_projects', 'total_revenue',
            'average_waste_percentage'
        ]


class MonthlyMetricsSerializer(serializers.ModelSerializer):
    """Serializer for MonthlyMetrics"""
    
    class Meta:
        model = MonthlyMetrics
        fields = [
            'id', 'year', 'month', 'completed_projects', 'in_progress_projects',
            'pending_projects', 'total_revenue', 'average_project_cost'
        ]
