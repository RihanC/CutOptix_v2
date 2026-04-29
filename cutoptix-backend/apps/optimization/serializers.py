from rest_framework import serializers
from .models import MaterialBar, CuttingPlan, Cut, OptimizationResult


class CutSerializer(serializers.ModelSerializer):
    """Serializer for Cut"""
    design_code = serializers.CharField(source='design.code', read_only=True)
    
    class Meta:
        model = Cut
        fields = ['id', 'design', 'design_code', 'cut_id', 'length', 'sequence_number']


class CuttingPlanSerializer(serializers.ModelSerializer):
    """Serializer for CuttingPlan"""
    cuts = CutSerializer(many=True, read_only=True)
    bar_id = serializers.CharField(source='bar.bar_id', read_only=True)
    
    class Meta:
        model = CuttingPlan
        fields = [
            'id', 'bar', 'bar_id', 'total_waste', 'waste_percentage',
            'efficiency_percentage', 'total_cuts', 'cost_per_unit', 'cuts'
        ]


class MaterialBarSerializer(serializers.ModelSerializer):
    """Serializer for MaterialBar"""
    
    class Meta:
        model = MaterialBar
        fields = [
            'id', 'bar_id', 'total_length', 'material_type', 'profile_code',
            'unit_cost', 'total_cost', 'is_used', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class OptimizationResultSerializer(serializers.ModelSerializer):
    """Serializer for OptimizationResult"""
    
    class Meta:
        model = OptimizationResult
        fields = [
            'id', 'project', 'total_bars_needed', 'total_bars_used',
            'average_efficiency', 'total_waste', 'total_material_cost',
            'is_optimized', 'algorithm_version', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
