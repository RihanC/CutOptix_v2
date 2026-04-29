from rest_framework import serializers
from .models import DesignSpecification


class DesignSpecificationSerializer(serializers.ModelSerializer):
    """Serializer for DesignSpecification"""
    
    class Meta:
        model = DesignSpecification
        fields = [
            'id', 'project', 'code', 'width', 'height', 'typology', 'glass_type',
            'mesh_required', 'finish', 'quantity', 'material_length', 'unit_cost',
            'total_cost', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'material_length', 'total_cost', 'created_at', 'updated_at']


class BulkDesignSerializer(serializers.Serializer):
    """Serializer for bulk creating designs"""
    designs = DesignSpecificationSerializer(many=True)
    
    def create(self, validated_data):
        """Override create to handle bulk creation"""
        designs = []
        project_id = self.context.get('project_id')
        for design_data in validated_data['designs']:
            design = DesignSpecification.objects.create(
                project_id=project_id,
                **design_data
            )
            designs.append(design)
        return designs
