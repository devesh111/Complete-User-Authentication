from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.conf import settings
from .models import SocialAccount, EmailVerificationToken
from .serializers import RegisterSerializer, LoginSerializer, SocialAuthSerializer
from .emails import send_verification_email
from .providers import PROVIDERS
import requests

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        token_obj = EmailVerificationToken.objects.create(user=user)
        send_verification_email(user.email, str(token_obj.token))
        return Response({"message": "Registered. Please verify email.", "verification_token": str(token_obj.token)}, status=201)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        token = request.query_params.get('token')
        try:
            t = EmailVerificationToken.objects.get(token=token, is_used=False)
        except EmailVerificationToken.DoesNotExist:
            return Response({"detail": "Invalid token"}, status=400)
        t.is_used = True; t.save()
        user = t.user; user.email_verified = True; user.save(update_fields=['email_verified'])
        return Response({"message": "Email verified"})

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token), 'refresh': str(refresh), 'user': {'id': user.id, 'username': user.username, 'email': user.email, 'email_verified': user.email_verified}})

class SocialAuthView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, provider):
        if provider not in PROVIDERS:
            return Response({"detail": "Unsupported provider"}, status=400)
        serializer = SocialAuthSerializer(data={**request.data, 'provider': provider})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        code = data.get('code')
        code_verifier = data.get('code_verifier')
        access_token = data.get('access_token')
        id_token = data.get('id_token')

        Provider = PROVIDERS[provider]

        # If code provided, exchange it
        if code and not access_token:
            try:
                if provider == 'google':
                    token_url = 'https://oauth2.googleapis.com/token'
                    payload = {
                        'code': code, 
                        'client_id': settings.GOOGLE_CLIENT_ID, 
                        'client_secret': settings.GOOGLE_CLIENT_SECRET, 
                        'redirect_uri': settings.OAUTH_REDIRECT_URI, 
                        'grant_type': 'authorization_code',
                    }
                    if code_verifier: payload['code_verifier'] = code_verifier
                    r = requests.post(
                            token_url, 
                            data = payload,
                        )
                    r.raise_for_status(); tok = r.json(); access_token = tok.get('access_token'); id_token = tok.get('id_token')

                elif provider == 'github':
                    token_url = 'https://github.com/login/oauth/access_token'
                    r = requests.post(
                            token_url, 
                            data = {
                                'client_id': settings.GITHUB_CLIENT_ID, 
                                'client_secret': settings.GITHUB_CLIENT_SECRET, 
                                'code': code, 
                                'redirect_uri': settings.OAUTH_REDIRECT_URI,
                            }, 
                            headers = {
                                'Accept': 'application/json',
                            }
                        )
                    r.raise_for_status(); access_token = r.json().get('access_token')

                elif provider == 'facebook':
                    token_url = 'https://graph.facebook.com/v17.0/oauth/access_token'
                    r = requests.get(
                            token_url, 
                            params = {
                                'client_id': settings.FACEBOOK_CLIENT_ID, 
                                'client_secret': settings.FACEBOOK_CLIENT_SECRET, 
                                'code': code, 
                                'redirect_uri': settings.OAUTH_REDIRECT_URI,
                            }
                        )
                    r.raise_for_status(); access_token = r.json().get('access_token')

                elif provider == 'linkedin':
                    token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
                    payload = {
                        'grant_type': 'authorization_code',
                        'code': code,
                        'client_id': settings.LINKEDIN_CLIENT_ID,
                        'client_secret': settings.LINKEDIN_CLIENT_SECRET,
                        'redirect_uri': settings.OAUTH_REDIRECT_URI,
                    }
                    if code_verifier: payload['code_verifier'] = code_verifier
                    r = requests.post(token_url, data=payload)
                    r.raise_for_status(); access_token = r.json().get('access_token')

            except requests.RequestException as e:
                return Response({
                    'detail': 'Code exchange failed', 
                    'error': str(e)
                }, status=400)

        # If we have id_token or access_token, fetch user
        try:
            if provider == 'google':
                if id_token:
                    uid, profile = Provider.fetch_user(id_token=id_token)
                else:
                    uid, profile = Provider.fetch_user(access_token=access_token)
            else:
                uid, profile = Provider.fetch_user(access_token)

        except Exception as e:
            return Response({
                'detail': 'Failed to fetch user from provider', 
                'error': str(e)
            }, status=400)

        email = profile.get('email')
        name = profile.get('name') or ''

        try:
            social = SocialAccount.objects.select_related('user').get(provider=provider, provider_uid=uid)
            user = social.user

        except SocialAccount.DoesNotExist:
            user = None
            if email:
                user = User.objects.filter(email=email).first()
            if not user:
                base_username = (name or email or f"{provider}_{uid}").split('@')[0].replace(' ', '').lower() or f"user_{str(uid)[:6]}"
                username = base_username; i = 1

                while User.objects.filter(username=username).exists():
                    i += 1; username = f"{base_username}{i}"

                user = User.objects.create(
                            username = username, 
                            email = email or f"{provider}_{uid}@example.com", 
                            email_verified = bool(email)
                        )
            SocialAccount.objects.create( 
                user=user, 
                provider=provider, 
                provider_uid=uid, 
                extra_data=profile
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response =  Response({
            'access': access_token, 
            'refresh': refresh_token, 
            'user': {
                'id': user.id, 
                'username': user.username, 
                'email': user.email, 
                'email_verified': user.email_verified
            }
        })

        # Store refresh token in HttpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,  # only secure in prod
            samesite="Lax",
            max_age=14 * 24 * 60 * 60,  # 2 weeks
        )
        return response

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        u = request.user
        return Response({
            'id': u.id, 
            'username': u.username, 
            'email': u.email, 
            'email_verified': u.email_verified, 
            'providers': list(u.social_accounts.values_list('provider', flat=True))
        })

class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out"})
        response.delete_cookie("refresh_token")
        return response

class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access": access_token})
        except Exception:
            raise InvalidToken("Invalid refresh token")