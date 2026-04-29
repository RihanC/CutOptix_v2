from rest_framework import serializers
from .models import Report, ReportTemplate


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'project', 'report_type', 'file', 'file_size', 'file_format',
            'status', 'error_message', 'created_by', 'created_by_name', 'created_at',
            'downloaded_count', 'last_downloaded_at'
        ]
        read_only_fields = ['id', 'file_size', 'created_at']


class ReportTemplateSerializer(serializers.ModelSerializer):
    """Serializer for ReportTemplate"""
    
    class Meta:
        model = ReportTemplate
        fields = ['id', 'name', 'report_type', 'template_content', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ReportGenerationSerializer(serializers.Serializer):
    """Serializer for generating reports"""
    report_type = serializers.ChoiceField(choices=['boq', 'cutting_chart', 'quotation', 'material_summary'])
