from django.contrib import admin
from .models import MaterialBar, CuttingPlan, Cut, OptimizationResult


@admin.register(MaterialBar)
class MaterialBarAdmin(admin.ModelAdmin):
    list_display = ['bar_id', 'project', 'total_length', 'material_type', 'is_used']
    list_filter = ['project', 'is_used', 'created_at']
    search_fields = ['bar_id', 'project__id']


@admin.register(CuttingPlan)
class CuttingPlanAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'bar', 'efficiency_percentage', 'waste_percentage']
    list_filter = ['project', 'created_at']
    search_fields = ['bar__bar_id']


@admin.register(Cut)
class CutAdmin(admin.ModelAdmin):
    list_display = ['cut_id', 'cutting_plan', 'design', 'length', 'sequence_number']
    list_filter = ['cutting_plan']
    search_fields = ['cut_id']


@admin.register(OptimizationResult)
class OptimizationResultAdmin(admin.ModelAdmin):
    list_display = ['project', 'average_efficiency', 'total_waste', 'is_optimized']
    list_filter = ['is_optimized', 'created_at']
    search_fields = ['project__id']
