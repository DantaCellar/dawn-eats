"""Post routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Post, User
from ..schemas import Post as PostSchema, PostCreate
from ..auth import get_current_user

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[PostSchema])
def get_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all posts."""
    posts = db.query(Post).offset(skip).limit(limit).all()
    return posts


@router.post("/", response_model=PostSchema)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new post."""
    db_post = Post(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@router.get("/{post_id}", response_model=PostSchema)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """Get a specific post."""
    post = db.query(Post).filter(Post.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post