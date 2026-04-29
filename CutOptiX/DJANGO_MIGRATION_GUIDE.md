# CutOptiX Django Migration Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Features Implementation](#features-implementation)
7. [Frontend Integration](#frontend-integration)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Guide](#deployment-guide)

---

## Project Overview

### Project Name
**CutOptiX** - A window and door fabrication optimization platform

### Project Type
Dashboard application for managing cutting optimization, project planning, cost analysis, and waste minimization for aluminum/material fabrication businesses.

### Current Tech Stack (React/Vite)
- **Frontend**: React 18 + TypeScript
- **UI Framework**: Radix UI Components
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks (local)
- **Authentication**: Hardcoded (sample1@gmail.com / pass123)

---

## Architecture & Tech Stack

### Proposed Django Architecture

```
cutoptix-backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── tests.py
│   ├── projects/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── filters.py
│   │   └── tests.py
│   ├── designs/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── tests.py
│   ├── optimization/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── algorithms.py
│   │   └── tests.py
│   ├── reports/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── generators/
│   │   │   ├── boq.py
│   │   │   ├── cutting_chart.py
│   │   │   ├── quotation.py
│   │   │   └── material_summary.py
│   │   └── tests.py
│   └── analytics/
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       ├── urls.py
│       ├── calculations.py
│       └── tests.py
├── static/
├── media/
└── templates/

```

### Key Technologies

#### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API development
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS handling
- **django-filter** - Advanced filtering
- **celery** - Async task processing (for heavy computations)
- **redis** - Caching and task queue
- **python-decouple** - Environment variables
- **pillow** - Image processing
- **reportlab** - PDF generation
- **openpyxl** - Excel file generation
- **pytest-django** - Testing framework

#### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

#### External Services
- **S3/MinIO** - File storage (for reports)
- **SendGrid/SMTP** - Email notifications

---

## Database Models

### 1. User & Authentication Models

#### User Model
```python
# apps/accounts/models.py

class CustomUser(AbstractUser):
    """Extended user model with additional fields"""
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('manager', 'Project Manager'),
        ('estimator', 'Estimator'),
        ('fabricator', 'Fabricator'),
        ('viewer', 'Viewer'),
    )
    
    company_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='estimator')
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    is_two_fa_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]
```

---

### 2. Project Models

#### Project Model
```python
# apps/projects/models.py

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
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True)
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
    total_material_usage = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # in meters
    waste_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Metadata
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='projects_created')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects_assigned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.id} - {self.name}"
    
    def calculate_waste_savings(self):
        """Calculate percentage of material saved"""
        pass
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['client_name']),
        ]
```

#### ProjectNote Model
```python
class ProjectNote(models.Model):
    """Notes and comments on projects"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='notes')
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
```

---

### 3. Design & Specification Models

#### DesignSpecification Model
```python
# apps/designs/models.py

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
    material_length = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Total material needed in mm
    
    # Cost
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Additional Details
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.code} - {self.width}x{self.height}"
    
    def calculate_total_material(self):
        """Calculate total material length required"""
        pass
    
    class Meta:
        ordering = ['code']
        indexes = [
            models.Index(fields=['project', 'code']),
        ]
        unique_together = ['project', 'code']
```

---

### 4. Optimization Models

#### MaterialBar Model
```python
# apps/optimization/models.py

class MaterialBar(models.Model):
    """Standard material bars/profiles"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='material_bars')
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
    
    def __str__(self):
        return f"{self.bar_id} - {self.total_length}mm"
    
    class Meta:
        ordering = ['-created_at']


class CuttingPlan(models.Model):
    """Optimized cutting plan for bars"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='cutting_plans')
    bar = models.ForeignKey(MaterialBar, on_delete=models.CASCADE, related_name='cutting_plans')
    
    # Waste & Efficiency
    total_waste = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    waste_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    efficiency_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Optimization Results
    total_cuts = models.IntegerField(default=0)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cutting Plan - {self.bar.bar_id}"


class Cut(models.Model):
    """Individual cuts in a cutting plan"""
    cutting_plan = models.ForeignKey(CuttingPlan, on_delete=models.CASCADE, related_name='cuts')
    design = models.ForeignKey(DesignSpecification, on_delete=models.SET_NULL, null=True)
    
    cut_id = models.CharField(max_length=50)  # C1, C2, C3, etc.
    length = models.DecimalField(max_digits=10, decimal_places=2)  # in mm
    sequence_number = models.IntegerField()  # Order in which cut is made
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sequence_number']


class OptimizationResult(models.Model):
    """Results of optimization algorithm"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='optimization_result')
    
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
    
    def __str__(self):
        return f"Optimization Result - {self.project.id}"
```

---

### 5. Report Models

#### Report Model
```python
# apps/reports/models.py

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
    file_size = models.IntegerField(null=True)  # in bytes
    file_format = models.CharField(max_length=10)  # pdf, xlsx, docx
    
    # Status
    status = models.CharField(max_length=20, choices=REPORT_STATUS, default='pending')
    error_message = models.TextField(blank=True)
    
    # Metadata
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    downloaded_count = models.IntegerField(default=0)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.get_report_type_display()} - {self.project.id}"
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'report_type']),
            models.Index(fields=['status']),
        ]


class ReportTemplate(models.Model):
    """Customizable report templates"""
    name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=30)
    template_content = models.JSONField()  # JSON structure for template
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

### 6. Analytics Models

#### ProjectAnalytics Model
```python
# apps/analytics/models.py

class ProjectAnalytics(models.Model):
    """Aggregated analytics for projects"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='analytics')
    
    # Cost Analytics
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_project_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_variance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Material Analytics
    material_efficiency = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    waste_reduction_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Temporal Data
    estimated_completion_date = models.DateField(null=True)
    actual_completion_date = models.DateField(null=True)
    time_variance = models.IntegerField(null=True)  # days
    
    updated_at = models.DateTimeField(auto_now=True)


class DailyMetrics(models.Model):
    """Daily aggregated metrics"""
    date = models.DateField(db_index=True)
    total_projects = models.IntegerField(default=0)
    completed_projects = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_waste_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ['date']


class MonthlyMetrics(models.Model):
    """Monthly aggregated metrics"""
    year = models.IntegerField()
    month = models.IntegerField()
    completed_projects = models.IntegerField(default=0)
    in_progress_projects = models.IntegerField(default=0)
    pending_projects = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_project_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ['year', 'month']
        ordering = ['-year', '-month']
```

---

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1/
```

### 1. Authentication Endpoints
```
POST   /auth/register/          - User registration
POST   /auth/login/             - User login (returns JWT tokens)
POST   /auth/refresh/           - Refresh JWT token
POST   /auth/logout/            - User logout
POST   /auth/verify-token/      - Verify token validity
POST   /auth/password-reset/    - Request password reset
POST   /auth/password-reset-confirm/  - Confirm password reset
```

### 2. User/Account Endpoints
```
GET    /accounts/profile/       - Get current user profile
PUT    /accounts/profile/       - Update current user profile
POST   /accounts/profile/upload-photo/  - Upload profile photo
GET    /accounts/settings/      - Get user settings
PUT    /accounts/settings/      - Update user settings
POST   /accounts/2fa/enable/    - Enable two-factor authentication
POST   /accounts/2fa/disable/   - Disable two-factor authentication
```

### 3. Project Endpoints
```
GET    /projects/               - List all projects (with filtering & pagination)
POST   /projects/               - Create new project
GET    /projects/{id}/          - Get project details
PUT    /projects/{id}/          - Update project
DELETE /projects/{id}/          - Delete project
GET    /projects/{id}/stats/    - Get project statistics
POST   /projects/{id}/notes/    - Add project note
GET    /projects/{id}/notes/    - Get project notes
PATCH  /projects/{id}/status/   - Update project status
```

### 4. Design Specification Endpoints
```
GET    /projects/{project_id}/designs/              - List all designs for a project
POST   /projects/{project_id}/designs/              - Create new design specification
GET    /projects/{project_id}/designs/{id}/         - Get design details
PUT    /projects/{project_id}/designs/{id}/         - Update design specification
DELETE /projects/{project_id}/designs/{id}/         - Delete design
POST   /projects/{project_id}/designs/bulk-create/  - Bulk create designs
```

### 5. Optimization Endpoints
```
POST   /projects/{project_id}/optimize/             - Run optimization algorithm
GET    /projects/{project_id}/optimization-result/  - Get optimization results
GET    /projects/{project_id}/cutting-plans/        - List cutting plans
GET    /projects/{project_id}/cutting-plans/{id}/   - Get cutting plan details
GET    /projects/{project_id}/material-bars/        - List material bars
POST   /projects/{project_id}/material-bars/        - Create material bar
```

### 6. Reports Endpoints
```
GET    /projects/{project_id}/reports/              - List project reports
POST   /projects/{project_id}/reports/              - Generate new report
GET    /projects/{project_id}/reports/{id}/download/ - Download report
GET    /projects/{project_id}/reports/{id}/preview/  - Preview report
DELETE /projects/{project_id}/reports/{id}/         - Delete report
POST   /projects/{project_id}/reports/batch-generate/ - Generate multiple reports
```

### 7. Analytics Endpoints
```
GET    /analytics/dashboard/                        - Dashboard analytics
GET    /analytics/projects/summary/                 - Project summary analytics
GET    /analytics/costs/trend/                      - Cost trend analytics
GET    /analytics/material/efficiency/              - Material efficiency metrics
GET    /analytics/waste/analysis/                   - Waste analysis
GET    /analytics/monthly-metrics/                  - Monthly metrics
GET    /analytics/export/                           - Export analytics data
```

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Role-Based Access Control (RBAC)

#### Roles
1. **Admin** - Full system access
2. **Manager** - Project management and reporting
3. **Estimator** - Design input and quotation generation
4. **Fabricator** - Manufacturing execution
5. **Viewer** - Read-only access

#### Permission Matrix

| Resource | Admin | Manager | Estimator | Fabricator | Viewer |
|----------|-------|---------|-----------|-----------|--------|
| View All Projects | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Project | ✓ | ✓ | ✓ | - | - |
| Edit Project | ✓ | ✓ | ✓ | - | - |
| Delete Project | ✓ | ✓ | - | - | - |
| View Designs | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Design | ✓ | ✓ | ✓ | - | - |
| Run Optimization | ✓ | ✓ | ✓ | - | - |
| Generate Reports | ✓ | ✓ | ✓ | - | - |
| View Analytics | ✓ | ✓ | ✓ | - | ✓ |
| Manage Users | ✓ | - | - | - | - |
| Manage Settings | ✓ | - | - | - | - |

### Implementation

#### Decorator for Permission Checks
```python
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated

@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST'])
def project_list(request):
    pass

# Custom permissions
class IsProjectManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'manager']

class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.`user or request.user.role == 'admin'
```

---

## Features Implementation

### 1. Dashboard Feature

#### Implementation
```python
# apps/analytics/views.py

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Fetch dashboard data with stats"""
        today = timezone.now().date()
        
        # Get stats
        stats = {
            'total_projects': Project.objects.filter(created_by=request.user).count(),
            'total_cost': Project.objects.filter(created_by=request.user).aggregate(
                total=Sum('total_cost'))['total'] or 0,
            'material_usage': Project.objects.filter(created_by=request.user).aggregate(
                total=Sum('total_material_usage'))['total'] or 0,
            'waste_saved': Project.objects.filter(created_by=request.user).aggregate(
                avg=Avg('waste_percentage'))['avg'] or 0,
        }
        
        # Get recent projects
        recent_projects = Project.objects.filter(
            created_by=request.user
        ).values('id', 'name', 'date', 'cost', 'status')[:5]
        
        return Response({
            'stats': stats,
            'recent_projects': recent_projects
        })
```

#### Frontend Integration
- Fetch data from `/api/v1/analytics/dashboard/`
- Display in React Dashboard component
- Auto-refresh every 30 seconds or on user action

---

### 2. Project Management Feature

#### Create Project
```python
# apps/projects/views.py

class ProjectCreateView(CreateAPIView):
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated, IsEstimator]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
```

#### List Projects with Filters
```python
class ProjectListView(ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['status', 'created_at', 'assigned_to']
    search_fields = ['name', 'client_name', 'id']
    ordering_fields = ['created_at', 'total_cost']
    
    def get_queryset(self):
        return Project.objects.filter(
            Q(created_by=self.request.user) | 
            Q(assigned_to=self.request.user)
        )
```

---

### 3. Design Input Feature

#### Bulk Design Entry
```python
# apps/designs/views.py

class BulkCreateDesignView(CreateAPIView):
    serializer_class = BulkDesignSerializer
    permission_classes = [IsAuthenticated, IsEstimator]
    
    def create(self, request, *args, **kwargs):
        """Create multiple designs from list"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        designs = []
        for design_data in serializer.validated_data['designs']:
            design = DesignSpecification.objects.create(
                project_id=kwargs['project_id'],
                **design_data
            )
            designs.append(design)
        
        return Response(
            DesignSpecificationSerializer(designs, many=True).data,
            status=status.HTTP_201_CREATED
        )
```

#### Material Calculation
```python
class DesignSpecificationSerializer(serializers.ModelSerializer):
    def validate(self, data):
        # Calculate material length based on dimensions
        width = data.get('width')
        height = data.get('height')
        
        # Formula: (width + height) * 2 * quantity
        material_length = (width + height) * 2 * data.get('quantity', 1)
        data['material_length'] = material_length
        
        return data
```

---

### 4. Cutting Optimization Feature

#### Optimization Algorithm
```python
# apps/optimization/algorithms.py

class CuttingOptimizer:
    """Cutting stock problem solver using first-fit decreasing algorithm"""
    
    def __init__(self, bar_length, designs):
        self.bar_length = bar_length
        self.designs = sorted(designs, key=lambda x: x.material_length, reverse=True)
        self.bars = []
        self.waste_total = 0
    
    def optimize(self):
        """Run optimization algorithm"""
        for design in self.designs:
            placed = False
            
            for bar in self.bars:
                if bar.remaining_space >= design.material_length:
                    bar.add_cut(design)
                    placed = True
                    break
            
            if not placed:
                new_bar = MaterialBar(
                    total_length=self.bar_length,
                    material_type=design.material_type
                )
                new_bar.add_cut(design)
                self.bars.append(new_bar)
        
        self.calculate_efficiency()
        return self.get_result()
    
    def calculate_efficiency(self):
        """Calculate cutting efficiency"""
        for bar in self.bars:
            bar.waste = bar.total_length - bar.used_length
            bar.efficiency = (bar.used_length / bar.total_length) * 100
            self.waste_total += bar.waste
    
    def get_result(self):
        """Return optimization result"""
        return {
            'bars': self.bars,
            'total_waste': self.waste_total,
            'average_efficiency': sum(b.efficiency for b in self.bars) / len(self.bars),
            'bars_needed': len(self.bars)
        }
```

#### Optimization Endpoint
```python
# apps/optimization/views.py

class OptimizeProjectView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, project_id):
        """Run optimization algorithm on project"""
        project = get_object_or_404(Project, id=project_id)
        designs = project.designs.all()
        
        optimizer = CuttingOptimizer(
            bar_length=6000,  # standard bar length in mm
            designs=designs
        )
        
        result = optimizer.optimize()
        
        # Save results
        optimization = OptimizationResult.objects.create(
            project=project,
            total_bars_needed=len(result['bars']),
            average_efficiency=result['average_efficiency'],
            total_waste=result['total_waste'],
            is_optimized=True
        )
        
        return Response({
            'optimization_result': OptimizationResultSerializer(optimization).data,
            'cutting_plans': result['bars']
        })
```

---

### 5. Report Generation Feature

#### Bill of Quantity Report
```python
# apps/reports/generators/boq.py

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class BOQGenerator:
    def __init__(self, project):
        self.project = project
        self.designs = project.designs.all()
    
    def generate(self):
        """Generate BOQ PDF"""
        filename = f"BOQ_{self.project.id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=letter)
        elements = []
        
        # Title
        styles = getSampleStyleSheet()
        title = Paragraph(f"Bill of Quantity - {self.project.name}", styles['Heading1'])
        elements.append(title)
        elements.append(Spacer(1, 0.5 * inch))
        
        # Project Details Table
        project_data = [
            ['Project ID:', self.project.id],
            ['Client:', self.project.client_name],
            ['Date:', self.project.created_at.strftime('%Y-%m-%d')],
        ]
        project_table = Table(project_data)
        elements.append(project_table)
        elements.append(Spacer(1, 0.3 * inch))
        
        # Materials Table
        materials_data = [['Code', 'Description', 'Quantity', 'Unit Cost', 'Total']]
        for design in self.designs:
            materials_data.append([
                design.code,
                f"{design.width}x{design.height}mm {design.typology}",
                str(design.quantity),
                f"${design.unit_cost:.2f}",
                f"${design.total_cost:.2f}"
            ])
        
        # Add totals
        total_cost = sum(d.total_cost for d in self.designs)
        materials_data.append(['', '', '', 'TOTAL:', f"${total_cost:.2f}"])
        
        materials_table = Table(materials_data)
        elements.append(materials_table)
        
        doc.build(elements)
        return filename
```

#### Excel Report
```python
# apps/reports/generators/cutting_chart.py

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

class CuttingChartGenerator:
    def __init__(self, project, optimization_result):
        self.project = project
        self.optimization = optimization_result
    
    def generate(self):
        """Generate cutting chart Excel"""
        wb = Workbook()
        ws = wb.active
        ws.title = "Cutting Plan"
        
        # Header
        ws['A1'] = f"Cutting Chart - {self.project.id}"
        ws['A1'].font = Font(bold=True, size=14)
        
        # Column headers
        headers = ['Bar ID', 'Bar Length', 'Used Length', 'Waste', 'Efficiency %']
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=3, column=col)
            cell.value = header
            cell.font = Font(bold=True)
            cell.fill = PatternFill(start_color='D3D3D3', end_color='D3D3D3', fill_type='solid')
        
        # Data rows
        row = 4
        for cutting_plan in self.optimization.cutting_plans.all():
            ws.cell(row=row, column=1).value = cutting_plan.bar.bar_id
            ws.cell(row=row, column=2).value = cutting_plan.bar.total_length
            ws.cell(row=row, column=3).value = cutting_plan.bar.total_length - cutting_plan.total_waste
            ws.cell(row=row, column=4).value = cutting_plan.total_waste
            ws.cell(row=row, column=5).value = f"{cutting_plan.efficiency_percentage:.2f}%"
            row += 1
        
        filename = f"CuttingChart_{self.project.id}.xlsx"
        wb.save(filename)
        return filename
```

#### Report Generation Task (Async)
```python
# apps/reports/tasks.py

from celery import shared_task

@shared_task
def generate_report(project_id, report_type):
    """Generate report asynchronously"""
    project = Project.objects.get(id=project_id)
    
    if report_type == 'boq':
        from .generators.boq import BOQGenerator
        generator = BOQGenerator(project)
        filename = generator.generate()
    
    elif report_type == 'cutting_chart':
        from .generators.cutting_chart import CuttingChartGenerator
        optimization = project.optimization_result
        generator = CuttingChartGenerator(project, optimization)
        filename = generator.generate()
    
    # Save to database
    report = Report.objects.create(
        project=project,
        report_type=report_type,
        file=filename,
        status='generated'
    )
    
    return report.id
```

---

### 6. Analytics Feature

#### Cost Trend Analysis
```python
# apps/analytics/views.py

class CostTrendView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get cost trends for dashboard"""
        last_7_months = timezone.now() - timedelta(days=210)
        
        data = Project.objects.filter(
            created_by=request.user,
            created_at__gte=last_7_months
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total_cost=Sum('total_cost'),
            project_count=Count('id')
        ).order_by('month')
        
        return Response(list(data))
```

#### Material Efficiency Calculation
```python
class MaterialEfficiencyView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_id):
        """Calculate material efficiency"""
        project = get_object_or_404(Project, id=project_id)
        
        total_material = project.designs.aggregate(Sum('material_length'))['material_length__sum'] or 0
        used_material = project.designs.aggregate(Sum('total_cost'))['total_cost__sum'] or 0
        
        efficiency = (used_material / total_material * 100) if total_material > 0 else 0
        
        return Response({
            'total_material': total_material,
            'used_material': used_material,
            'waste_material': total_material - used_material,
            'efficiency_percentage': efficiency
        })
```

---

## Frontend Integration

### Frontend-Backend Communication

#### API Client Setup
```typescript
// src/api/client.ts

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class APIClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          // Handle token refresh or redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
  get(url: string, config = {}) {
    return this.client.get(url, config);
  }
  
  post(url: string, data: any, config = {}) {
    return this.client.post(url, data, config);
  }
  
  put(url: string, data: any, config = {}) {
    return this.client.put(url, data, config);
  }
  
  delete(url: string, config = {}) {
    return this.client.delete(url, config);
  }
}

export const apiClient = new APIClient();
```

#### API Hooks
```typescript
// src/hooks/useProjects.ts

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  total_cost: number;
  created_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/projects/');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };
  
  const createProject = async (projectData: any) => {
    try {
      const response = await apiClient.post('/projects/', projectData);
      setProjects([...projects, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  
  return { projects, loading, error, fetchProjects, createProject };
}
```

#### Component Integration
```typescript
// src/app/components/pages/Dashboard.tsx

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/analytics/dashboard/');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.stats && Object.entries(stats.stats).map(([key, value]) => (
          <Card key={key} className="p-6">
            <p className="text-sm text-gray-600">{key}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
          </Card>
        ))}
      </div>
      
      {/* Recent Projects */}
      {/* ... */}
    </div>
  );
}
```

---

## Testing Strategy

### Unit Tests

#### Model Tests
```python
# apps/projects/tests.py

from django.test import TestCase
from apps.projects.models import Project

class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            id='PRJ-001',
            name='Test Project',
            client_name='Test Client',
            budget=50000,
            total_units=20
        )
    
    def test_project_creation(self):
        self.assertEqual(self.project.name, 'Test Project')
        self.assertEqual(self.project.status, 'draft')
    
    def test_waste_calculation(self):
        waste_percentage = self.project.calculate_waste_savings()
        self.assertIsNotNone(waste_percentage)
```

#### API Tests
```python
# apps/projects/tests/test_views.py

from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class ProjectAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_project(self):
        data = {
            'id': 'PRJ-001',
            'name': 'Test Project',
            'client_name': 'Test Client',
            'budget': 50000
        }
        response = self.client.post('/api/v1/projects/', data)
        self.assertEqual(response.status_code, 201)
    
    def test_list_projects(self):
        response = self.client.get('/api/v1/projects/')
        self.assertEqual(response.status_code, 200)
```

### Integration Tests
```python
# tests/integration/test_optimization_flow.py

class OptimizationFlowTest(APITestCase):
    def test_full_project_optimization_flow(self):
        """Test complete flow: project creation → design entry → optimization"""
        
        # 1. Create project
        project_data = {...}
        project_response = self.client.post('/api/v1/projects/', project_data)
        project_id = project_response.data['id']
        
        # 2. Add designs
        design_data = {...}
        self.client.post(f'/api/v1/projects/{project_id}/designs/', design_data)
        
        # 3. Run optimization
        opt_response = self.client.post(f'/api/v1/projects/{project_id}/optimize/')
        self.assertEqual(opt_response.status_code, 200)
        
        # 4. Generate report
        report_response = self.client.post(f'/api/v1/projects/{project_id}/reports/', {
            'report_type': 'boq'
        })
        self.assertEqual(report_response.status_code, 201)
```

---

## Deployment Guide

### Requirements.txt
```
Django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.0.0
django-filter==23.1
psycopg2-binary==2.9.6
celery==5.2.7
redis==4.5.4
pillow==9.5.0
reportlab==4.0.4
openpyxl==3.10.9
python-decouple==3.8
gunicorn==20.1.0
whitenoise==6.4.0
```

### Environment Variables (.env)
```
DEBUG=False
SECRET_KEY=your-secret-key-here

DATABASE_URL=postgresql://user:password@localhost:5432/cutoptix
REDIS_URL=redis://localhost:6379/0

JWT_SECRET_KEY=your-jwt-secret-key

ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=cutoptix-reports

EMAIL_BACKEND=sendgrid
SENDGRID_API_KEY=your-sendgrid-key

CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Docker Configuration

#### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### Docker-Compose
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: cutoptix
      POSTGRES_USER: cutoptix_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  web:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://cutoptix_user:secure_password@db:5432/cutoptix
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery:
    build: .
    command: celery -A config worker -l info
    environment:
      DATABASE_URL: postgresql://cutoptix_user:secure_password@db:5432/cutoptix
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery-beat:
    build: .
    command: celery -A config beat -l info
    environment:
      DATABASE_URL: postgresql://cutoptix_user:secure_password@db:5432/cutoptix
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### Deployment Steps

#### 1. Server Setup
```bash
# Install system dependencies
sudo apt update
sudo apt install python3.11 python3-pip postgresql redis-server

# Clone repository
git clone <repo-url>
cd cutoptix-backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Database Setup
```bash
# Create database and user
sudo -u postgres createdb cutoptix
sudo -u postgres createuser cutoptix_user
sudo -u postgres psql
ALTER ROLE cutoptix_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cutoptix TO cutoptix_user;

# Run migrations
python manage.py migrate --settings=config.settings.production
```

#### 3. Static Files
```bash
python manage.py collectstatic --noinput --settings=config.settings.production
```

#### 4. Nginx Configuration
```nginx
upstream django {
    server localhost:8000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    client_max_body_size 10M;
    
    location /static/ {
        alias /app/staticfiles/;
    }
    
    location /media/ {
        alias /app/media/;
    }
    
    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5. Systemd Services

##### Gunicorn Service
```ini
# /etc/systemd/system/cutoptix.service

[Unit]
Description=CutOptix Django Application
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/app
Environment="PATH=/app/venv/bin"
ExecStart=/app/venv/bin/gunicorn config.wsgi:application \
    --bind unix:/tmp/cutoptix.sock \
    --workers 4 \
    --worker-class sync \
    --timeout 120

[Install]
WantedBy=multi-user.target
```

##### Celery Service
```ini
# /etc/systemd/system/cutoptix-celery.service

[Unit]
Description=CutOptix Celery Worker
After=network.target

[Service]
Type=forking
User=www-data
WorkingDirectory=/app
Environment="PATH=/app/venv/bin"
ExecStart=/app/venv/bin/celery -A config worker \
    --loglevel=info \
    --pidfile=/var/run/celery.pid

[Install]
WantedBy=multi-user.target
```

#### 6. Enable Services
```bash
sudo systemctl daemon-reload
sudo systemctl enable cutoptix
sudo systemctl enable cutoptix-celery
sudo systemctl start cutoptix
sudo systemctl start cutoptix-celery
```

---

## Key Considerations

### Performance Optimization
1. **Database Indexing**: Add indexes on frequently queried fields
2. **Query Optimization**: Use `select_related()` and `prefetch_related()` to reduce queries
3. **Caching**: Implement Redis caching for analytics and dashboard data
4. **Pagination**: Implement pagination for large datasets
5. **Async Tasks**: Use Celery for heavy computations (reports, optimization)

### Security Measures
1. **JWT Token Expiration**: Set reasonable expiration times
2. **Rate Limiting**: Implement API rate limiting
3. **Input Validation**: Validate all user inputs
4. **HTTPS**: Enable HTTPS in production
5. **CORS**: Properly configure CORS for frontend
6. **Data Encryption**: Encrypt sensitive data in database
7. **Audit Logging**: Log all important actions

### Scalability
1. **Load Balancing**: Use Nginx/HAProxy for multiple Django instances
2. **Database Replication**: Set up PostgreSQL replication
3. **Horizontal Scaling**: Run multiple Celery workers
4. **CDN**: Use CDN for static files and reports

---

## Future Enhancements

1. **Advanced Reporting**: Custom report templates
2. **Real-time Collaboration**: WebSocket integration for team collaboration
3. **Mobile App**: Native mobile application
4. **AI Integration**: ML for predictive cost analysis
5. **Integration APIs**: Third-party software integration (CAD, ERP)
6. **Advanced Analytics**: Predictive analytics and forecasting
7. **Multi-language Support**: Internationalization (i18n)
8. **Dark Mode**: Theme customization
9. **Advanced Search**: Elasticsearch integration
10. **File Management**: Document management system

---

## Conclusion

This guide provides a comprehensive blueprint for migrating the CutOptiX dashboard from React to a Django-based full-stack application. The architecture is scalable, follows REST principles, and maintains separation of concerns. Implement features incrementally, starting with core functionality (authentication, projects, designs) and progressively adding advanced features (optimization, reporting, analytics).
