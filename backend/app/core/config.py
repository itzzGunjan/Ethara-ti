import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ethara Workspace API"
    DATABASE_URL: str = "sqlite:///./app.db"
    
    class Config:
        case_sensitive = True

settings = Settings()
