from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from apps.projects.models import Project
from .models import ProjectAnalytics, DailyMetrics, MonthlyMetrics
from .serializers import (
    ProjectAnalyticsSerializer, DailyMetricsSerializer, MonthlyMetricsSerializer
)


class AnalyticsViewSet(viewsets.ViewSet):
    """ViewSet for analytics operations"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard analytics"""
        user = request.user
        
        # Filter projects based on user role
        if user.role == 'admin':
            projects = Project.objects.all()
        else:
            projects = Project.objects.filter(
                Q(created_by=user) | Q(assigned_to=user)
            )
        
        stats = {
            'total_projects': projects.count(),
            'completed_projects': projects.filter(status='completed').count(),
            'in_progress_projects': projects.filter(status='in_progress').count(),
            'total_cost': projects.aggregate(Sum('total_cost'))['total_cost__sum'] or 0,
            'average_cost': projects.aggregate(Avg('total_cost'))['total_cost__avg'] or 0,
            'material_usage': projects.aggregate(Sum('total_material_usage'))['total_material_usage__sum'] or 0,
            'average_waste': projects.aggregate(Avg('waste_percentage'))['waste_percentage__avg'] or 0,
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def projects_summary(self, request):
        """Get project summary analytics"""
        projects = Project.objects.all()
        
        summary = {
            'by_status': dict(
                projects.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
            'total_value': projects.aggregate(Sum('total_cost'))['total_cost__sum'] or 0,
            'average_value': projects.aggregate(Avg('total_cost'))['total_cost__avg'] or 0,
        }
        
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def cost_trend(self, request):
        """Get cost trends for last 7 months"""
        last_7_months = timezone.now() - timedelta(days=210)
        
        data = Project.objects.filter(
            created_at__gte=last_7_months
        ).extra(
            select={'month': 'date_trunc(\'month\', created_at)'}
        ).values('month').annotate(
            total_cost=Sum('total_cost'),
            project_count=Count('id')
        ).order_by('month')
        
        return Response(list(data))
    
    @action(detail=False, methods=['get'])
    def material_efficiency(self, request):
        """Get material efficiency metrics"""
        projects = Project.objects.exclude(total_material_usage=0)
        
        efficiency = {
            'average_efficiency': projects.aggregate(
                avg_waste=Avg('waste_percentage')
            )['avg_waste__avg'] or 0,
            'total_material': projects.aggregate(
                Sum('total_material_usage')
            )['total_material_usage__sum'] or 0,
            'projects_analyzed': projects.count(),
        }
        
        return Response(efficiency)
    
    @action(detail=False, methods=['get'])
    def waste_analysis(self, request):
        """Get waste analysis"""
        projects = Project.objects.exclude(waste_percentage=0)
        
        waste_analysis = {
            'average_waste_percentage': projects.aggregate(
                Avg('waste_percentage')
            )['waste_percentage__avg'] or 0,
            'total_waste_amount': sum(
                (p.total_material_usage * p.waste_percentage / 100) for p in projects
            ),
            'worst_performer': projects.order_by('-waste_percentage').first().id if projects.exists() else None,
            'best_performer': projects.order_by('waste_percentage').first().id if projects.exists() else None,
        }
        
        return Response(waste_analysis)
    
    @action(detail=False, methods=['get'])
    def monthly_metrics(self, request):
        """Get monthly metrics"""
        queryset = MonthlyMetrics.objects.all().order_by('-year', '-month')[:12]
        serializer = MonthlyMetricsSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export analytics data"""
        # This would typically export data to CSV or PDF
        projects = Project.objects.all()
        
        export_data = {
            'total_projects': projects.count(),
            'total_revenue': projects.aggregate(Sum('total_cost'))['total_cost__sum'] or 0,
            'average_project_cost': projects.aggregate(Avg('total_cost'))['total_cost__avg'] or 0,
            'total_material_usage': projects.aggregate(Sum('total_material_usage'))['total_material_usage__sum'] or 0,
            'export_date': timezone.now().isoformat(),
        }
        
        return Response(export_data)


from django.db.models import Q
