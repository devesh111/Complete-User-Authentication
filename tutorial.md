# Tutorial: Complete-User-Authentication

This project offers a *complete user authentication system* for both traditional email/password and *social logins* (Google, GitHub, etc.). It features **email verification** for new accounts and uses **secure tokens** to manage user sessions across the frontend and backend.


## Visual Overview

```mermaid
flowchart TD
    A0["User Authentication Flow (Backend)
"]
    A1["User and Account Data Models
"]
    A2["Social Login Provider Integration
"]
    A3["Email Verification System
"]
    A4["Frontend Authentication State Management
"]
    A5["API Communication Layer (Frontend)
"]
    A6["PKCE (Proof Key for Code Exchange) Security
"]
    A0 -- "Manages User Data" --> A1
    A0 -- "Triggers Verification" --> A3
    A0 -- "Utilizes Social Providers" --> A2
    A0 -- "Verifies PKCE" --> A6
    A1 -- "Defines User Schema" --> A0
    A1 -- "Stores Tokens" --> A3
    A2 -- "Authenticates Users" --> A0
    A3 -- "Confirms User Email" --> A0
    A4 -- "Handles API Calls" --> A5
    A4 -- "Reflects Backend Auth" --> A0
    A5 -- "Sends Backend Requests" --> A0
    A5 -- "Transmits PKCE" --> A6
    A6 -- "Generates Security Params" --> A5
    A6 -- "Secures OAuth Requests" --> A2
```

## Chapters

1. [User and Account Data Models
](01_user_and_account_data_models_.md)
2. [User Authentication Flow (Backend)
](02_user_authentication_flow__backend__.md)
3. [Social Login Provider Integration
](03_social_login_provider_integration_.md)
4. [Email Verification System
](04_email_verification_system_.md)
5. [PKCE (Proof Key for Code Exchange) Security
](05_pkce__proof_key_for_code_exchange__security_.md)
6. [API Communication Layer (Frontend)
](06_api_communication_layer__frontend__.md)
7. [Frontend Authentication State Management
](07_frontend_authentication_state_management_.md)

---

<sub><sup>Written by [Devesh](https://github.com/devesh111).</sup></sub>