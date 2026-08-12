from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import get_db
from app.models.note import Note
from app.schemas.note import (
    NoteCreate, NoteUpdate, NoteResponse,
    PredictRequest, PredictResponse, ModelInfoResponse,
)
from app.ml import classifier

router = APIRouter(prefix="/api/notes", tags=["Notes"])


@router.get("", response_model=List[NoteResponse])
def get_notes(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Note)
    if category:
        query = query.filter(Note.category == category)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Note.title.ilike(pattern)) | (Note.content.ilike(pattern))
        )
    notes = query.order_by(Note.created_at.desc()).offset(offset).limit(limit).all()
    return [NoteResponse(**n.to_dict()) for n in notes]


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteResponse(**note.to_dict())


@router.post("", response_model=NoteResponse, status_code=201)
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    full_text = f"{data.title} {data.content}"
    if data.category and data.priority:
        category = data.category
        priority = data.priority
        confidence = None
        ai_classified = False
        tags = data.tags or []
    else:
        prediction = classifier.predict(full_text)
        category = data.category or prediction["category"]
        priority = data.priority or prediction["priority"]
        confidence = prediction["confidence"]
        ai_classified = True
        tags = data.tags or prediction["tags"]
    note = Note(
        title=data.title,
        content=data.content,
        category=category,
        priority=priority,
        tags=",".join(tags),
        ai_classified=ai_classified,
        confidence=confidence,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return NoteResponse(**note.to_dict())


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if data.title is not None:
        note.title = data.title
    if data.content is not None:
        note.content = data.content
    if data.category is not None:
        note.category = data.category
    if data.priority is not None:
        note.priority = data.priority
    if data.tags is not None:
        note.tags = ",".join(data.tags)
    db.commit()
    db.refresh(note)
    return NoteResponse(**note.to_dict())


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"status": "deleted", "id": note_id}


@router.get("/stats/summary")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Note).count()
    ai_classified = db.query(Note).filter(Note.ai_classified == True).count()
    cat_counts = {}
    for cat in ["Work", "Personal", "Health", "Finance", "Learning", "Creative"]:
        cat_counts[cat] = db.query(Note).filter(Note.category == cat).count()
    pri_counts = {}
    for pri in ["Low", "Medium", "High", "Critical"]:
        pri_counts[pri] = db.query(Note).filter(Note.priority == pri).count()
    return {
        "totalNotes": total,
        "aiClassified": ai_classified,
        "categoryDistribution": cat_counts,
        "priorityDistribution": pri_counts,
        "modelInfo": classifier.get_model_info(),
    }