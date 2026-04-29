from django.db import models
from apps.projects.models import Project


class DesignSpecification(models.Model):
    """Window/Door design specifications"""
    
    TYPOLOGY_CHOICES = (
        ('sliding', 'Sliding Window'),
        ('casement', 'Casement Window'),
        ('fixed', 'Fixed Window'),
        ('door_single', 'Single Door'),
        ('door_double', 'Double Door'),
        ('jalousie', 'Jalousie Window'),
        ('awning', 'Awning Window'),
    )
    
    GLASS_TYPES = (
        ('clear', 'Clear Glass'),
        ('tinted', 'Tinted Glass'),
        ('frosted', 'Frosted Glass'),
        ('tempered', 'Tempered Glass'),
        ('laminated', 'Laminated Glass'),
        ('double_glazed', 'Double Glazed'),
    )
    
    FINISH_CHOICES = (
        ('anodized', 'Anodized'),
        ('powder_coat', 'Powder Coat'),
        ('raw', 'Raw'),
        ('polished', 'Polished'),
        ('wood_grain', 'Wood Grain'),
    )
    
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='designs')
    code = models.CharField(max_length=50)  # W-001, D-002, etc.
    
    # Dimensions
    width = models.DecimalField(max_digits=10, decimal_places=2)  # in mm
    height = models.DecimalField(max_digits=10, decimal_places=2)  # in mm
    
    # Specifications
    typology = models.CharField(max_length=20, choices=TYPOLOGY_CHOICES)
    glass_type = models.CharField(max_length=30, choices=GLASS_TYPES)
    mesh_required = models.BooleanField(default=False)
    finish = models.CharField(max_length=20, choices=FINISH_CHOICES)
    
    # Material Tracking
    quantity = models.IntegerField(default=1)
    material_length = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )  # Total material needed in mm
    
    # Cost
    unit_cost = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Additional Details
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['code']
        indexes = [
            models.Index(fields=['project', 'code']),
        ]
        unique_together = ['project', 'code']
        verbose_name = 'Design Specification'
        verbose_name_plural = 'Design Specifications'
    
    def __str__(self):
        return f"{self.code} - {self.width}x{self.height}"
    
    def calculate_total_material(self):
        """Calculate total material length required"""
        # Formula: (width + height) * 2 * quantity
        self.material_length = (self.width + self.height) * 2 * self.quantity
        return self.material_length
    
    def save(self, *args, **kwargs):
        """Override save to calculate material length and cost"""
        self.calculate_total_material()
        if self.unit_cost:
            self.total_cost = self.unit_cost * self.quantity
        super().save(*args, **kwargs)
