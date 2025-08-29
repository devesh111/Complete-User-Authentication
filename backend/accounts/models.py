from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    REQUIRED_FIELDS = ["email"]

class SocialAccount(models.Model):
    PROVIDERS = (
        ("google","Google"),
        ("github","GitHub"),
        ("facebook","Facebook"),
        ("linkedin","LinkedIn"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDERS)
    provider_uid = models.CharField(max_length=255)
    extra_data = models.JSONField(default=dict, blank=True)
    class Meta:
        unique_together = ("provider","provider_uid")

class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_tokens')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    is_used = models.BooleanField(default=False)
