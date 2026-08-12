from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, Index
from sqlalchemy.sql import func
from app.models import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    priority = Column(String(20), nullable=False, default="Medium")
    tags = Column(String(1000), nullable=True)
    ai_classified = Column(Boolean, default=False)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        Index("idx_notes_category_created", "category", "created_at"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "category": self.category,
            "priority": self.priority,
            "tags": self.tags.split(",") if self.tags else [],
            "aiClassified": self.ai_classified,
            "confidence": self.confidence,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }