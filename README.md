# Restaurant App

A full-stack restaurant management application with modern frontend and backend technologies.

---

## Table of Contents

- [Overview](#overview)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  
- [Backend Setup](#backend-setup)  
- [Frontend Setup](#frontend-setup)  
- [Testing](#testing)  
- [License](#license)

---

## Overview

This project is a Restaurant App built with a **Django REST Framework** backend and a **Next.js + TypeScript** frontend. It includes JWT authentication, PostgreSQL database support, modern state management, and smooth animations. The frontend is styled with TailwindCSS and uses Zustand for state management and GSAP for animations.

---

## Tech Stack

**Backend:**
- Django + Django REST Framework
- JWT Authentication (`djangorestframework-simplejwt`)
- PostgreSQL

**Frontend:**
- Next.js + TypeScript
- Zustand (state management)
- GSAP (animations)
- TailwindCSS (styling)

**Other:**
- CORS configured for frontend-backend communication

---

## Features

- **User Authentication:** Signup/Login using JWT tokens
- **Restaurant Management:** Create, read, update, and delete menus, and dishes
- **Dietary Preferences:** Attach dietary preferences to users
- **Animations:** Smooth animations using GSAP
- **Responsive UI:** Fully responsive design using TailwindCSS
- **State Management:** Global state with Zustand
- **Secure API:** JWT-based authentication, CORS enabled

---

## Backend Setup

1. Clone the repository:

```bash
  git clone https://github.com/Elie-50/restaurant
  cd restaurant/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables
```bash
# Database
DB_NAME=db_name
DB_USER=user
DB_PASSWORD="password"
DB_HOST=localhost
DB_PORT=5432

# Secret keys
SECRET_KEY='secret_key'

# server
DEBUG=True
ALLOWED_HOSTS="http://localhost:8000"
```

5. Apply migrations:
```bash
python manage.py migrate
```

6. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Navigate to the frontend folder:
``` bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
```

## Testing

1. Backend tests:
```bash
python manage.py test
```

2. Frontend tests:
```bash
npm run test
```