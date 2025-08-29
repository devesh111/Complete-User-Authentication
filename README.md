# Complete User Authentication (Backend + Frontend)

## Backend
````
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp sample.config.yaml config.yaml
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
````

## Frontend
````
cd frontend
npm install
npm run dev
cp .env.example .env
````

Frontend expects backend at http://localhost:8000/api
Ensure OAuth client IDs and redirect URIs are configured in provider consoles.

## What’s inside & how to run

#### backend/ — Django project.

requirements.txt — ```pip install``` these in a virtualenv.

```manage.py```, social_api/ and accounts/ app with PKCE-capable ```SocialAuthView```.

Copy ```.env.example``` → ```.env``` and fill provider ```client IDs/secrets``` and ```OAUTH_REDIRECT_URI``` (must match frontend).

Run migrations and ```python manage.py runserver```.

#### frontend/ — Vite + React app.

```package.json```, ```vite.config.js```, ```src/``` with Redux, PKCE utils, social buttons, and OAuthCallback page.

Copy ```.env.example``` → ```.env``` and set VITE_* variables.

```npm install``` then ```npm run dev```.

### Notes & next steps

Backend expects redirect URI at http://localhost:5173/auth/callback by default; update envs if you change that.

Ensure provider consoles (Google/GitHub/Facebook/LinkedIn) have that redirect URI registered.

The frontend sends ```{ code, code_verifier }``` to ```/api/auth/social/<provider>/```. Backend exchanges code (using client secret) and returns JWT tokens.

The frontend uses a refresh endpoint at ```/auth/token/refresh/``` (SimpleJWT). If you name routes differently, update ```frontend/src/store/authSlice.js```.
