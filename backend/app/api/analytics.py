from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from collections import Counter

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
def get_dashboard_analytics(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    goals = db.query(models.Goal).all()
    
    # Task Counts
    total_tasks = len(tasks)
    todo_tasks = sum(1 for t in tasks if t.status == "todo")
    progress_tasks = sum(1 for t in tasks if t.status == "in_progress")
    done_tasks = sum(1 for t in tasks if t.status == "done")
    
    task_completion_rate = (done_tasks / total_tasks * 100) if total_tasks > 0 else 0.0
    
    # Priority Distribution
    priorities = [t.priority for t in tasks]
    priority_counts = dict(Counter(priorities))
    # Ensure all exist
    for p in ["low", "medium", "high"]:
        if p not in priority_counts:
            priority_counts[p] = 0
            
    # Category Distribution
    categories = [t.category for t in tasks]
    category_counts = dict(Counter(categories))
    
    # Goal Metrics
    total_goals = len(goals)
    total_milestones = 0
    completed_milestones = 0
    
    for g in goals:
        for ms in g.milestones:
            total_milestones += 1
            if ms.is_completed:
                completed_milestones += 1
                
    goal_completion_rate = (completed_milestones / total_milestones * 100) if total_milestones > 0 else 0.0
    
    # Calculate a composite daily productivity score (0 to 100)
    # Based on task completion and goal completion
    productivity_score = 0.0
    if total_tasks > 0 or total_milestones > 0:
        task_weight = 0.6
        goal_weight = 0.4
        
        t_score = (done_tasks / total_tasks * 100) if total_tasks > 0 else 100.0
        g_score = (completed_milestones / total_milestones * 100) if total_milestones > 0 else 100.0
        
        # If one of them has zero elements, let the other carry 100% of the weight
        if total_tasks == 0:
            productivity_score = g_score
        elif total_milestones == 0:
            productivity_score = t_score
        else:
            productivity_score = (t_score * task_weight) + (g_score * goal_weight)
            
    return {
        "tasks": {
            "total": total_tasks,
            "todo": todo_tasks,
            "in_progress": progress_tasks,
            "done": done_tasks,
            "completion_rate": round(task_completion_rate, 1)
        },
        "priorities": priority_counts,
        "categories": category_counts,
        "goals": {
            "total": total_goals,
            "total_milestones": total_milestones,
            "completed_milestones": completed_milestones,
            "completion_rate": round(goal_completion_rate, 1)
        },
        "productivity_score": round(productivity_score, 0)
    }
