from django.urls import path
from .views import RegisterView, VerifyEmailView, LoginView, SocialAuthView, MeView, LogoutView, CookieTokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view()), 
    path('auth/verify-email/', VerifyEmailView.as_view()), 
    path('auth/login/', LoginView.as_view()), 
    path('auth/social/<str:provider>/', SocialAuthView.as_view()), 
    path('auth/me/', MeView.as_view()),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/token/refresh/", CookieTokenRefreshView.as_view()),
]
