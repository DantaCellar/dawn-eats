"""Pydantic schemas for request/response models."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


# User schemas
class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Post schemas
class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: User

    class Config:
        from_attributes = True


# Recipe schemas
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[str] = None
    nutrition_info: Optional[Dict[str, Any]] = None


class RecipeCreate(RecipeBase):
    pass


class Recipe(RecipeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: User

    class Config:
        from_attributes = True


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None