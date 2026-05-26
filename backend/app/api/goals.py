from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db import models, schemas

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("/", response_model=List[schemas.Goal])
def read_goals(db: Session = Depends(get_db)):
    return db.query(models.Goal).all()

@router.post("/", response_model=schemas.Goal, status_code=status.HTTP_201_CREATED)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = models.Goal(
        title=goal.title,
        description=goal.description,
        category=goal.category
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)

    for ms in goal.milestones:
        db_ms = models.Milestone(
            goal_id=db_goal.id,
            title=ms.title,
            is_completed=ms.is_completed
        )
        db.add(db_ms)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.put("/{goal_id}", response_model=schemas.Goal)
def update_goal(goal_id: int, goal_update: schemas.GoalUpdate, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(db_goal)
    db.commit()
    return None

# --- Milestone Toggle Routes ---

@router.put("/milestones/{milestone_id}/toggle", response_model=schemas.Milestone)
def toggle_milestone(milestone_id: int, db: Session = Depends(get_db)):
    db_ms = db.query(models.Milestone).filter(models.Milestone.id == milestone_id).first()
    if not db_ms:
        raise HTTPException(status_code=404, detail="Milestone not found")
    db_ms.is_completed = not db_ms.is_completed
    db.commit()
    db.refresh(db_ms)
    return db_ms
