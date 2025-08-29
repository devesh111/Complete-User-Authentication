from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(email: str, token: str):
    verify_url = f"{settings.HOST}/api/auth/verify-email/?token={token}"
    subject = "Verify your email"
    body = f"Click to verify: {verify_url}\nToken: {token}"
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=True)
