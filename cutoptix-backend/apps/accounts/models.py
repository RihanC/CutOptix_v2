from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Extended user model with additional fields"""
    
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('manager', 'Project Manager'),
        ('estimator', 'Estimator'),
        ('fabricator', 'Fabricator'),
        ('viewer', 'Viewer'),
    )
    
    company_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='estimator')
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    is_two_fa_enabled = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
            models.Index(fields=['email']),
        ]
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def get_full_name(self):
        """Return the user's full name"""
        return f"{self.first_name} {self.last_name}".strip() or self.username
