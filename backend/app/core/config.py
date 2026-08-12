from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Synapse AI"
    APP_VERSION: str = "2.4.0"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./synapse.db"
    SECRET_KEY: str = "change-this-to-a-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    MODEL_PATH: str = "app/ml/model.joblib"
    VOCAB_PATH: str = "app/ml/vocabulary.json"
    RETRAIN_ON_STARTUP: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()