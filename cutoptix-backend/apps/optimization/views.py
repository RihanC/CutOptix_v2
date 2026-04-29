from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from apps.projects.models import Project
from .models import MaterialBar, CuttingPlan, OptimizationResult
from .serializers import (
    MaterialBarSerializer, CuttingPlanSerializer, OptimizationResultSerializer
)
from .algorithms import CuttingOptimizer


class MaterialBarViewSet(viewsets.ModelViewSet):
    """ViewSet for MaterialBar management"""
    queryset = MaterialBar.objects.all()
    serializer_class = MaterialBarSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter material bars by project"""
        project_id = self.kwargs.get('project_id')
        if project_id:
            return MaterialBar.objects.filter(project_id=project_id)
        return MaterialBar.objects.all()
    
    def perform_create(self, serializer):
        """Set project from URL parameter"""
        project_id = self.kwargs.get('project_id')
        serializer.save(project_id=project_id)


class CuttingPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for CuttingPlan (read-only)"""
    queryset = CuttingPlan.objects.all()
    serializer_class = CuttingPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter cutting plans by project"""
        project_id = self.kwargs.get('project_id')
        if project_id:
            return CuttingPlan.objects.filter(project_id=project_id)
        return CuttingPlan.objects.all()


class OptimizationViewSet(viewsets.ViewSet):
    """ViewSet for running optimization"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def run_optimization(self, request, project_id=None):
        """Run optimization algorithm on project"""
        project = get_object_or_404(Project, id=project_id)
        designs = list(project.designs.all())
        
        if not designs:
            return Response(
                {'error': 'Project has no designs'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run optimizer
        optimizer = CuttingOptimizer(bar_length=6000, designs=designs)
        result = optimizer.optimize()
        
        # Create optimization result
        optimization, created = OptimizationResult.objects.update_or_create(
            project=project,
            defaults={
                'total_bars_needed': len(result['bars']),
                'total_bars_used': len(result['bars']),
                'average_efficiency': result['average_efficiency'],
                'total_waste': result['total_waste'],
                'total_material_cost': sum(
                    d.total_cost for d in designs
                ),
                'is_optimized': True,
                'algorithm_version': '1.0.0'
            }
        )
        
        # Clear existing cutting plans
        CuttingPlan.objects.filter(project=project).delete()
        
        # Create new cutting plans based on optimization result
        for idx, bar in enumerate(result['bars']):
            # Create material bar if not exists
            material_bar, _ = MaterialBar.objects.get_or_create(
                project=project,
                bar_id=f"BAR-{idx+1:03d}",
                defaults={
                    'total_length': 6000,
                    'material_type': 'Aluminum Profile',
                    'unit_cost': 100,
                    'total_cost': 100 * 6000 / 1000
                }
            )
            
            # Create cutting plan
            cutting_plan = CuttingPlan.objects.create(
                project=project,
                bar=material_bar,
                total_waste=bar.get_waste(),
                waste_percentage=(bar.get_waste() / 6000 * 100),
                efficiency_percentage=bar.get_efficiency(),
                total_cuts=len(bar.cuts)
            )
        
        serializer = OptimizationResultSerializer(optimization)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def result(self, request, project_id=None):
        """Get optimization result for project"""
        project = get_object_or_404(Project, id=project_id)
        try:
            optimization = OptimizationResult.objects.get(project=project)
            serializer = OptimizationResultSerializer(optimization)
            return Response(serializer.data)
        except OptimizationResult.DoesNotExist:
            return Response(
                {'error': 'No optimization result found'},
                status=status.HTTP_404_NOT_FOUND
            )
