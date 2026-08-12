from pydantic import BaseModel, Field
from typing import Optional


class UserCreate(BaseModel):
    email: str = Field(..., min_length=5)
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str = Field(..., min_length=5)
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    isActive: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"