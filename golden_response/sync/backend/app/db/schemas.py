from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional

# --- Milestone Schemas ---
class MilestoneBase(BaseModel):
    title: str
    is_completed: bool = False

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None

class Milestone(MilestoneBase):
    id: int
    goal_id: int

    class Config:
        from_attributes = True

# --- Goal Schemas ---
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "general"

class GoalCreate(GoalBase):
    milestones: Optional[List[MilestoneCreate]] = []

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class Goal(GoalBase):
    id: int
    created_at: datetime
    milestones: List[Milestone] = []

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    category: str = "general"
    due_date: Optional[date] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[date] = None

class Task(TaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
