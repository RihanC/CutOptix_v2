import uuid
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http import FileResponse

from apps.projects.models import Project
from .models import Report, ReportTemplate
from .serializers import ReportSerializer, ReportTemplateSerializer, ReportGenerationSerializer


class ReportViewSet(viewsets.ModelViewSet):
    """ViewSet for Report management"""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter reports by project"""
        project_id = self.kwargs.get('project_id')
        if project_id:
            return Report.objects.filter(project_id=project_id)
        return Report.objects.all()
    
    @action(detail=False, methods=['post'])
    def generate(self, request, project_id=None):
        """Generate a new report"""
        project = get_object_or_404(Project, id=project_id)
        serializer = ReportGenerationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        report_type = serializer.validated_data['report_type']
        
        # Create report instance
        report_id = f"{project_id}-{report_type}-{uuid.uuid4().hex[:8]}"
        report = Report.objects.create(
            id=report_id,
            project=project,
            report_type=report_type,
            file_format='pdf' if report_type == 'quotation' else 'xlsx',
            status='pending',
            created_by=request.user
        )
        
        # TODO: Implement async task for actual report generation
        # For now, mark as generated
        report.status = 'generated'
        report.save()
        
        serializer = ReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def download(self, request, project_id=None, pk=None):
        """Download a report"""
        report = self.get_object()
        
        if not report.file:
            return Response(
                {'error': 'Report file not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update download statistics
        report.downloaded_count += 1
        report.last_downloaded_at = datetime.now()
        report.save()
        
        return FileResponse(report.file.open('rb'), as_attachment=True)
    
    @action(detail=True, methods=['get'])
    def preview(self, request, project_id=None, pk=None):
        """Preview a report"""
        report = self.get_object()
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def batch_generate(self, request, project_id=None):
        """Generate multiple reports"""
        project = get_object_or_404(Project, id=project_id)
        report_types = request.data.get('report_types', [])
        
        if not report_types:
            return Response(
                {'error': 'No report types specified'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        generated_reports = []
        for report_type in report_types:
            report_id = f"{project_id}-{report_type}-{uuid.uuid4().hex[:8]}"
            report = Report.objects.create(
                id=report_id,
                project=project,
                report_type=report_type,
                file_format='pdf' if report_type == 'quotation' else 'xlsx',
                status='generated',
                created_by=request.user
            )
            generated_reports.append(report)
        
        serializer = ReportSerializer(generated_reports, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReportTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for ReportTemplate management"""
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsAuthenticated]
