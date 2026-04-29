from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import UserViewSet, TokenObtainPairView as CustomTokenObtainPairView
from apps.projects.views import ProjectViewSet
from apps.designs.views import DesignViewSet
from apps.optimization.views import MaterialBarViewSet, CuttingPlanViewSet, OptimizationViewSet
from apps.reports.views import ReportViewSet, ReportTemplateViewSet
from apps.analytics.views import AnalyticsViewSet

# Create routers
router = DefaultRouter()

# Account routes
router.register(r'accounts', UserViewSet, basename='user')

# Project routes
router.register(r'projects', ProjectViewSet, basename='project')

# Design routes (nested under projects)
# Will be handled with custom URL patterns

# Optimization routes
router.register(r'material-bars', MaterialBarViewSet, basename='material-bar')
router.register(r'cutting-plans', CuttingPlanViewSet, basename='cutting-plan')
router.register(r'optimization', OptimizationViewSet, basename='optimization')

# Report routes
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'report-templates', ReportTemplateViewSet, basename='report-template')

# Analytics routes
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API routes
    path('api/v1/', include(router.urls)),
    
    # Authentication
    path('api/v1/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Design routes (nested)
    path(
        'api/v1/projects/<str:project_id>/designs/',
        DesignViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='project-designs-list'
    ),
    path(
        'api/v1/projects/<str:project_id>/designs/<int:pk>/',
        DesignViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
        name='project-designs-detail'
    ),
    path(
        'api/v1/projects/<str:project_id>/designs/bulk-create/',
        DesignViewSet.as_view({'post': 'bulk_create'}),
        name='project-designs-bulk-create'
    ),
    
    # Report routes (nested)
    path(
        'api/v1/projects/<str:project_id>/reports/',
        ReportViewSet.as_view({'get': 'list', 'post': 'generate'}),
        name='project-reports-list'
    ),
    path(
        'api/v1/projects/<str:project_id>/reports/<str:pk>/download/',
        ReportViewSet.as_view({'get': 'download'}),
        name='project-reports-download'
    ),
    path(
        'api/v1/projects/<str:project_id>/reports/<str:pk>/preview/',
        ReportViewSet.as_view({'get': 'preview'}),
        name='project-reports-preview'
    ),
    path(
        'api/v1/projects/<str:project_id>/reports/batch-generate/',
        ReportViewSet.as_view({'post': 'batch_generate'}),
        name='project-reports-batch-generate'
    ),
    
    # Material bar routes (nested)
    path(
        'api/v1/projects/<str:project_id>/material-bars/',
        MaterialBarViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='project-material-bars-list'
    ),
    
    # Cutting plan routes (nested)
    path(
        'api/v1/projects/<str:project_id>/cutting-plans/',
        CuttingPlanViewSet.as_view({'get': 'list'}),
        name='project-cutting-plans-list'
    ),
    path(
        'api/v1/projects/<str:project_id>/cutting-plans/<int:pk>/',
        CuttingPlanViewSet.as_view({'get': 'retrieve'}),
        name='project-cutting-plans-detail'
    ),
    
    # Optimization routes (nested)
    path(
        'api/v1/projects/<str:project_id>/optimize/',
        OptimizationViewSet.as_view({'post': 'run_optimization'}),
        name='project-optimize'
    ),
    path(
        'api/v1/projects/<str:project_id>/optimization-result/',
        OptimizationViewSet.as_view({'get': 'result'}),
        name='project-optimization-result'
    ),
]

# Add static and media file serving in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
