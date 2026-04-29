from django.db import models
from apps.projects.models import Project
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectAnalytics(models.Model):
    """Aggregated analytics for projects"""
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name='analytics'
    )
    
    # Cost Analytics
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_project_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    cost_variance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Material Analytics
    material_efficiency = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    waste_reduction_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0
    )
    
    # Temporal Data
    estimated_completion_date = models.DateField(null=True, blank=True)
    actual_completion_date = models.DateField(null=True, blank=True)
    time_variance = models.IntegerField(null=True, blank=True)  # days
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Project Analytics'
        verbose_name_plural = 'Project Analytics'
    
    def __str__(self):
        return f"Analytics - {self.project.id}"


class DailyMetrics(models.Model):
    """Daily aggregated metrics"""
    date = models.DateField(db_index=True)
    total_projects = models.IntegerField(default=0)
    completed_projects = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_waste_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0
    )
    
    class Meta:
        unique_together = ['date']
        verbose_name = 'Daily Metrics'
        verbose_name_plural = 'Daily Metrics'
        ordering = ['-date']
    
    def __str__(self):
        return f"Daily Metrics - {self.date}"


class MonthlyMetrics(models.Model):
    """Monthly aggregated metrics"""
    year = models.IntegerField()
    month = models.IntegerField()
    completed_projects = models.IntegerField(default=0)
    in_progress_projects = models.IntegerField(default=0)
    pending_projects = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_project_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    
    class Meta:
        unique_together = ['year', 'month']
        ordering = ['-year', '-month']
        verbose_name = 'Monthly Metrics'
        verbose_name_plural = 'Monthly Metrics'
    
    def __str__(self):
        return f"Monthly Metrics - {self.year}-{self.month:02d}"
