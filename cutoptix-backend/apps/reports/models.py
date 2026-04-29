from django.db import models
from apps.projects.models import Project
from django.contrib.auth import get_user_model

User = get_user_model()


class Report(models.Model):
    """Generated reports for projects"""
    
    REPORT_TYPES = (
        ('boq', 'Bill of Quantity'),
        ('cutting_chart', 'Cutting Chart'),
        ('quotation', 'Project Quotation'),
        ('material_summary', 'Material Summary'),
    )
    
    REPORT_STATUS = (
        ('pending', 'Pending'),
        ('generated', 'Generated'),
        ('failed', 'Failed'),
    )
    
    id = models.CharField(max_length=100, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    
    # File Information
    file = models.FileField(upload_to='reports/', null=True, blank=True)
    file_size = models.IntegerField(null=True, blank=True)  # in bytes
    file_format = models.CharField(max_length=10)  # pdf, xlsx, docx
    
    # Status
    status = models.CharField(max_length=20, choices=REPORT_STATUS, default='pending')
    error_message = models.TextField(blank=True)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    downloaded_count = models.IntegerField(default=0)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'report_type']),
            models.Index(fields=['status']),
        ]
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
    
    def __str__(self):
        return f"{self.get_report_type_display()} - {self.project.id}"


class ReportTemplate(models.Model):
    """Customizable report templates"""
    
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=30)
    template_content = models.JSONField()  # JSON structure for template
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'
    
    def __str__(self):
        return self.name
