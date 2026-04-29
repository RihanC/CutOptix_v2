from django.contrib import admin
from .models import DesignSpecification


@admin.register(DesignSpecification)
class DesignSpecificationAdmin(admin.ModelAdmin):
    list_display = ['code', 'project', 'typology', 'width', 'height', 'quantity', 'created_at']
    list_filter = ['project', 'typology', 'glass_type', 'created_at']
    search_fields = ['code', 'project__id']
    ordering = ['-created_at']
