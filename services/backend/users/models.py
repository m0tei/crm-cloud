from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin / Management"
        PHOTOGRAPHER = "photographer", "Photographer"
        REPRESENTATIVE = "representative", "Representative Student"
        STUDENT = "student", "Basic Student"

    # Required fields
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    # Optional / future-proof fields
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    REQUIRED_FIELDS = ['email']  # username and password are required by default

    # Convenience properties
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_photographer(self):
        return self.role == self.Role.PHOTOGRAPHER

    @property
    def is_representative(self):
        return self.role == self.Role.REPRESENTATIVE

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"