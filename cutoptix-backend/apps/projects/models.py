from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Project(models.Model):
    """Main project model for tracking fabrication projects"""
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    id = models.CharField(max_length=20, primary_key=True)  # PRJ-001, PRJ-002
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    client_name = models.CharField(max_length=255)
    location = models.CharField(max_length=500, blank=True)
    
    # Project Details
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    total_units = models.IntegerField(default=0)
    deadline = models.DateField(null=True, blank=True)
    
    # Status Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    progress_percentage = models.IntegerField(default=0)
    
    # Cost Tracking
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    material_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    labor_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Material Tracking
    total_material_usage = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )  # in meters
    waste_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Metadata
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='projects_created'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projects_assigned',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['client_name']),
        ]
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    
    def __str__(self):
        return f"{self.id} - {self.name}"
    
    def calculate_waste_savings(self):
        """Calculate percentage of material saved"""
        pass
    
    def calculate_total_cost(self):
        """Calculate total project cost"""
        self.total_cost = self.material_cost + self.labor_cost
        return self.total_cost


class ProjectNote(models.Model):
    """Notes and comments on projects"""
    
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='notes'
    )
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project Note'
        verbose_name_plural = 'Project Notes'
    
    def __str__(self):
        return f"Note on {self.project.id} by {self.created_by}"
