from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Sum, Avg

from .models import Project, ProjectNote
from .serializers import (
    ProjectSerializer, ProjectCreateSerializer, ProjectUpdateSerializer,
    ProjectNoteSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for Project management"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'created_at', 'assigned_to']
    search_fields = ['name', 'client_name', 'id']
    ordering_fields = ['created_at', 'total_cost', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter projects based on user role"""
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all()
        return Project.objects.filter(
            Q(created_by=user) | Q(assigned_to=user)
        )
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return ProjectUpdateSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get project statistics"""
        project = self.get_object()
        stats = {
            'total_cost': str(project.total_cost),
            'material_cost': str(project.material_cost),
            'labor_cost': str(project.labor_cost),
            'total_material_usage': str(project.total_material_usage),
            'waste_percentage': str(project.waste_percentage),
            'progress_percentage': project.progress_percentage,
        }
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """Add a note to the project"""
        project = self.get_object()
        serializer = ProjectNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        """Get all notes for a project"""
        project = self.get_object()
        notes = project.notes.all()
        serializer = ProjectNoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update project status"""
        project = self.get_object()
        status_value = request.data.get('status')
        if not status_value:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        project.status = status_value
        project.save()
        return Response(ProjectSerializer(project).data)
