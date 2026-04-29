from django.db import models
from apps.projects.models import Project
from apps.designs.models import DesignSpecification


class MaterialBar(models.Model):
    """Standard material bars/profiles"""
    
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='material_bars'
    )
    bar_id = models.CharField(max_length=50)  # BAR-001, BAR-002
    
    # Bar Specifications
    total_length = models.DecimalField(max_digits=10, decimal_places=2)  # in mm
    material_type = models.CharField(max_length=100)  # Aluminum Profile, etc.
    profile_code = models.CharField(max_length=100, blank=True)
    
    # Cost
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Tracking
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Material Bar'
        verbose_name_plural = 'Material Bars'
    
    def __str__(self):
        return f"{self.bar_id} - {self.total_length}mm"


class CuttingPlan(models.Model):
    """Optimized cutting plan for bars"""
    
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='cutting_plans'
    )
    bar = models.ForeignKey(
        MaterialBar, on_delete=models.CASCADE, related_name='cutting_plans'
    )
    
    # Waste & Efficiency
    total_waste = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    waste_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    efficiency_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Optimization Results
    total_cuts = models.IntegerField(default=0)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Cutting Plan'
        verbose_name_plural = 'Cutting Plans'
    
    def __str__(self):
        return f"Cutting Plan - {self.bar.bar_id}"


class Cut(models.Model):
    """Individual cuts in a cutting plan"""
    
    cutting_plan = models.ForeignKey(
        CuttingPlan, on_delete=models.CASCADE, related_name='cuts'
    )
    design = models.ForeignKey(
        DesignSpecification, on_delete=models.SET_NULL, null=True
    )
    
    cut_id = models.CharField(max_length=50)  # C1, C2, C3, etc.
    length = models.DecimalField(max_digits=10, decimal_places=2)  # in mm
    sequence_number = models.IntegerField()  # Order in which cut is made
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sequence_number']
        verbose_name = 'Cut'
        verbose_name_plural = 'Cuts'


class OptimizationResult(models.Model):
    """Results of optimization algorithm"""
    
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name='optimization_result'
    )
    
    # Summary Statistics
    total_bars_needed = models.IntegerField()
    total_bars_used = models.IntegerField()
    average_efficiency = models.DecimalField(max_digits=5, decimal_places=2)
    total_waste = models.DecimalField(max_digits=12, decimal_places=2)
    total_material_cost = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Status
    is_optimized = models.BooleanField(default=False)
    algorithm_version = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Optimization Result'
        verbose_name_plural = 'Optimization Results'
    
    def __str__(self):
        return f"Optimization Result - {self.project.id}"
