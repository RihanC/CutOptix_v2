from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.projects.models import Project
from .models import DesignSpecification
from .serializers import DesignSpecificationSerializer, BulkDesignSerializer


class DesignViewSet(viewsets.ModelViewSet):
    """ViewSet for DesignSpecification management"""
    queryset = DesignSpecification.objects.all()
    serializer_class = DesignSpecificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'typology', 'glass_type']
    
    def get_queryset(self):
        """Filter designs based on project"""
        project_id = self.kwargs.get('project_id')
        if project_id:
            return DesignSpecification.objects.filter(project_id=project_id)
        return DesignSpecification.objects.all()
    
    def perform_create(self, serializer):
        """Set project from URL parameter"""
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request, project_id=None):
        """Create multiple designs at once"""
        project = Project.objects.get(id=project_id)
        serializer = BulkDesignSerializer(
            data=request.data,
            context={'project_id': project_id}
        )
        serializer.is_valid(raise_exception=True)
        designs = serializer.save()
        return Response(
            DesignSpecificationSerializer(designs, many=True).data,
            status=status.HTTP_201_CREATED
        )
