from pydantic import BaseModel, Field
from typing import List, Optional


class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    priority: str
    tags: List[str]
    aiClassified: bool
    confidence: Optional[float] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

    class Config:
        from_attributes = True


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1)


class PredictResponse(BaseModel):
    category: str
    confidence: float
    probabilities: dict
    priority: str
    tags: List[str]


class ModelInfoResponse(BaseModel):
    trained: bool
    architecture: Optional[str] = None
    vocabularySize: Optional[int] = None
    categories: Optional[List[str]] = None
    trainingSamples: Optional[int] = None
    lossCurve: Optional[List[float]] = None
    bestValidationScore: Optional[float] = None
    nIter: Optional[int] = None