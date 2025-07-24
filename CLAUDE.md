# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dawn Eats (旦食) is a breakfast culture mobile application that helps users discover, share, and record wonderful breakfast moments. The project uses a modern frontend-backend separation architecture.

## Tech Stack

**Frontend**: React Native + Expo + TypeScript
- Framework: React Native 0.72.0 with Expo ~49.0.0
- Navigation: React Navigation v6
- Language: TypeScript 5.1.3

**Backend**: Python + FastAPI + SQLite
- Language: Python 3.12
- Package Manager: uv
- Web Framework: FastAPI
- ORM: SQLAlchemy 2.0 with Alembic for migrations
- Authentication: JWT tokens (python-jose)
- Database: SQLite (development environment)

## Common Development Commands

### Frontend Development
```bash
cd frontend
npm install              # Install dependencies
npm start               # Start Expo development server
npm run android         # Run on Android device/emulator
npm run ios             # Run on iOS device/simulator
npm run web             # Run in web browser
npm test                # Run Jest tests
npm run lint            # Run ESLint
```

### Backend Development
```bash
cd backend
uv sync                                    # Install/sync dependencies
uv run uvicorn main:app --reload          # Start development server (port 8000)
uv run uvicorn main:app --reload --port 8080  # Start on port 8080
uv run alembic revision --autogenerate    # Generate database migration
uv run alembic upgrade head               # Apply database migrations
```

### Bootstrap Development Environment
```bash
./bootstrap.sh          # Install all dependencies and optionally start services
```

## Architecture Overview

The application follows a clean architecture pattern:

**Frontend Structure** (expected based on docs/ARCHITECTURE.md):
```
frontend/src/
├── components/         # Reusable UI components
├── screens/           # Screen/page components
├── navigation/        # Navigation configuration
├── services/          # API service layer
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

**Backend Structure**:
```
backend/
├── app/
│   ├── routers/       # API route handlers (users, posts, recipes)
│   ├── models.py      # SQLAlchemy database models (User, Post, Recipe)
│   ├── schemas.py     # Pydantic request/response schemas
│   ├── database.py    # Database connection and session management
│   └── auth.py        # Authentication utilities (JWT, password hashing)
├── main.py           # FastAPI application entry point
└── pyproject.toml    # uv/Python project configuration
```

## Key Features

- User registration/login with JWT authentication
- Breakfast content sharing (posts)
- Recipe management
- Health check endpoint at `/health`

## API Structure

Base URL: `http://localhost:8000/api/v1`

Main route groups:
- `/users` - User registration, login, profile
- `/posts` - Breakfast sharing posts
- `/recipes` - Recipe management

## Database

- SQLite database with SQLAlchemy ORM
- Core models: User, Post, Recipe
- Database migrations handled by Alembic
- Development database stored as `dawn_eats.db`
- Automatic table creation on startup

## Development Environment

- Backend runs on port 8000 (FastAPI with auto-reload)
- API documentation available at http://localhost:8000/docs (Swagger UI)
- SQLite database stored locally
- Frontend uses Expo development server
- CORS middleware configured for cross-origin requests

## MVP Features Implemented

**Backend API (Complete)**:
- User registration and authentication (JWT tokens)
- User login/logout functionality
- Post creation and retrieval for meal sharing
- Recipe creation and retrieval
- Health check endpoint
- API documentation via Swagger UI at http://localhost:8000/docs

**Frontend Mobile App (Complete)**:
- Welcome/onboarding screen
- User registration and login screens
- Bottom tab navigation (Home, Discover, Post, Profile)
- Home screen with meal posts feed
- Post creation screen for sharing meals
- Discover screen for exploring recipes and campus food
- Profile screen with user stats and settings
- Authentication context and API integration

**Core MVP User Flows**:
1. **User Registration/Login**: Complete authentication flow
2. **Meal Sharing**: Users can create and view meal posts
3. **Food Discovery**: Browse recipes and food categories
4. **User Profile**: View profile stats and manage settings

## Important Notes

- Use `uv` for all Python dependency management
- FastAPI provides automatic API documentation via Swagger UI
- JWT tokens require SECRET_KEY environment variable
- Database URL format: `postgresql://user:password@host:port/database`
- Frontend requires compatible Expo SDK 49 dependencies
- All assets (icons, splash screens) are placeholder images