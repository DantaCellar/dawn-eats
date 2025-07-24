"""Recipe routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Recipe, User
from ..schemas import Recipe as RecipeSchema, RecipeCreate
from ..auth import get_current_user

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/", response_model=List[RecipeSchema])
def get_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all recipes."""
    recipes = db.query(Recipe).offset(skip).limit(limit).all()
    return recipes


@router.post("/", response_model=RecipeSchema)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new recipe."""
    db_recipe = Recipe(**recipe.dict(), user_id=current_user.id)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.get("/{recipe_id}", response_model=RecipeSchema)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    """Get a specific recipe."""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe