import requests
from django.conf import settings
from typing import Tuple, Dict

class ProviderError(Exception):
    pass

class GoogleProvider:
    name = 'google'

    @staticmethod
    def fetch_user(access_token=None, id_token=None):
        if id_token:
            from google.oauth2 import id_token as google_id_token
            from google.auth.transport import requests as grequests

            info = google_id_token.verify_oauth2_token(
                id_token, 
                grequests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            return info.get('sub'), {
                'email': info.get('email'), 
                'name': info.get('name'), 
                'picture': info.get('picture'),
            }

        if access_token:
            r = requests.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo', 
                    headers = {
                        'Authorization': f'Bearer { access_token }',
                    }
                )

            r.raise_for_status()
            data = r.json()

            return data.get('sub'), {
                'email': data.get('email'), 
                'name': data.get('name'), 
                'picture': data.get('picture'),
            }

        raise ProviderError('Provide id_token or access_token')

class GitHubProvider:
    name = 'github'

    @staticmethod
    def exchange_code(code, code_verifier=None):
        r = requests.post(
                'https://github.com/login/oauth/access_token', 
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

        r.raise_for_status(); return r.json().get('access_token')

    @staticmethod
    def fetch_user(access_token):
        u = requests.get(
                'https://api.github.com/user', 
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/vnd.github+json',
                }
            )

        u.raise_for_status(); ud = u.json()
        email = ud.get('email')

        if not email:
            e = requests.get(
                    'https://api.github.com/user/emails', 
                    headers = {
                        'Authorization': f'Bearer {access_token}',
                    }
                )

            if e.status_code==200:
                emails = e.json(); primary = next((x['email'] for x in emails if x.get('primary')), None)
                email = primary or (emails[0]['email'] if emails else None)

        return str(ud.get('id')), {
            'email': email, 
            'name': ud.get('name') or ud.get('login'), 
            'avatar_url': ud.get('avatar_url'),
        }

class FacebookProvider:
    name = 'facebook'

    @staticmethod
    def fetch_user(access_token):
        fields = 'id,name,email'
        r = requests.get(
                f'https://graph.facebook.com/me?fields={fields}', 
                headers = {
                    'Authorization': f'Bearer {access_token}',
                }
            )

        r.raise_for_status(); d = r.json(); return d.get('id'), {
            'email': d.get('email'), 
            'name': d.get('name'),
        }

class LinkedInProvider:
    name = 'linkedin'

    @staticmethod
    def exchange_code(code, code_verifier=None):
        r = requests.post(
                'https://www.linkedin.com/oauth/v2/accessToken', 
                data = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'client_id': settings.LINKEDIN_CLIENT_ID,
                    'client_secret': settings.LINKEDIN_CLIENT_SECRET,
                    'redirect_uri': settings.OAUTH_REDIRECT_URI,
                }
            )

        r.raise_for_status(); return r.json().get('access_token')

    @staticmethod
    def fetch_user(access_token):
        u = requests.get(
                'https://api.linkedin.com/v2/me', 
                headers = {
                    'Authorization': f'Bearer {access_token}',
                }
            )

        u.raise_for_status(); prof = u.json()

        emailr = requests.get(
                'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', 
                headers = {
                    'Authorization': f'Bearer {access_token}',
                }
            )

        email = None

        if emailr.status_code==200:
            els = emailr.json().get('elements', [])
            if els: email = els[0].get('handle~', {}).get('emailAddress')

        uid = prof.get('id'); name = f"{prof.get('localizedFirstName','')} {prof.get('localizedLastName','')}"
        return uid, {
            'email': email, 
            'name': name,
        }

PROVIDERS = {
    'google': GoogleProvider, 
    'github': GitHubProvider, 
    'facebook': FacebookProvider, 
    'linkedin': LinkedInProvider,
}
