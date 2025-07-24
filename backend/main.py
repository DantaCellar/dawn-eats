"""FastAPI backend for Dawn Eats application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routers import users, posts, recipes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dawn Eats API",
    description="旦食 - 早餐文化移动应用后端 API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(recipes.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "旦食 API 服务运行正常"
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Dawn Eats API",
        "docs": "/docs"
    }
