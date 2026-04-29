from rest_framework import serializers
from .models import Project, ProjectNote


class ProjectNoteSerializer(serializers.ModelSerializer):
    """Serializer for ProjectNote"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectNote
        fields = ['id', 'content', 'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    notes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'client_name', 'location', 'budget',
            'total_units', 'deadline', 'status', 'progress_percentage',
            'total_cost', 'material_cost', 'labor_cost', 'total_material_usage',
            'waste_percentage', 'created_by', 'created_by_name', 'assigned_to',
            'assigned_to_name', 'notes_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_notes_count(self, obj):
        return obj.notes.count()


class ProjectCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating projects"""
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'client_name', 'location', 'budget',
            'total_units', 'deadline'
        ]
        read_only_fields = ['id']


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating projects"""
    
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'client_name', 'location', 'budget',
            'total_units', 'deadline', 'status', 'progress_percentage',
            'material_cost', 'labor_cost', 'total_material_usage',
            'waste_percentage', 'assigned_to'
        ]
