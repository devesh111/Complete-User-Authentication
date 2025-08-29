from django.contrib import admin
from .models import User, SocialAccount, EmailVerificationToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id","username","email","email_verified")

@admin.register(SocialAccount)
class SocialAdmin(admin.ModelAdmin):
    list_display = ("id","user","provider","provider_uid")
    
@admin.register(EmailVerificationToken)
class EmailTokenAdmin(admin.ModelAdmin):
    list_display = ("id","user","token","is_used","created_at")
