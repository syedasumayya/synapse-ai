import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";

const TABS = [
  { id: "api", label: "API (FastAPI)", icon: "api" },
  { id: "ml", label: "ML Model", icon: "psychology" },
  { id: "db", label: "Database", icon: "storage" },
  { id: "req", label: "Requirements", icon: "list" },
];

const CODE: Record<string, string> = {
  api: `# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.ml import classifier
from app.api import notes, ml, auth
from app.models import Base, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    classifier.predict("init check")
    print(f"  {settings.APP_NAME} v{settings.APP_VERSION} ready")
    yield

app = FastAPI(title=settings.APP_NAME,
              version=settings.APP_VERSION,
              lifespan=lifespan)

app.add_middleware(CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"], allow_headers=["*"])

app.include_router(notes.router)
app.include_router(ml.router)
app.include_router(auth.router)

@app.get("/api/health")
def health():
    return {"status": "healthy"}`,
  ml: `# backend/app/ml/classifier.py
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
import numpy as np

class TextClassifier:
    def __init__(self):
        self.vectorizer = CountVectorizer(
            vocabulary=VOCABULARY, binary=True)
        self.model = MLPClassifier(
            hidden_layer_sizes=(32, 16),
            activation="relu", max_iter=500,
            learning_rate_init=0.05,
            early_stopping=True)

    def predict(self, text: str) -> dict:
        X = self.vectorizer.transform([text]).toarray()
        probs = self.model.predict_proba(X)[0]
        idx = np.argmax(probs)
        return {
            "category": self.encoder.classes_[idx],
            "confidence": float(probs[idx]),
            "priority": self._estimate_priority(text),
            "tags": self._extract_tags(text)
        }`,
  db: `# backend/app/models/note.py
from sqlalchemy import (Column, Integer, String,
    Text, Boolean, DateTime, Float, Index)
from sqlalchemy.sql import func
from app.models import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    priority = Column(String(20), default="Medium")
    tags = Column(String(1000))
    ai_classified = Column(Boolean, default=False)
    confidence = Column(Float)
    created_at = Column(DateTime, server_default=func.now())`,
  req: `# requirements.txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
psycopg2-binary==2.9.10
pydantic==2.10.4
pydantic-settings==2.7.1
scikit-learn==1.6.0
numpy==2.2.1
joblib==1.4.2
python-multipart==0.0.20
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
alembic==1.14.1
httpx==0.28.1
pytest==8.3.4

# Run server:
# uvicorn app.main:app --reload`,
};

export const PythonBackend: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const [activeTab, setActiveTab] = useState("api");

  return (
    <>
      <Header title="Python Backend" subtitle="Production-grade backend code" onMenuToggle={onMenuToggle} showNewButton={false} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
        <div className="flex gap-2 flex-wrap anim-fade-up">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${activeTab === t.id ? "bg-accent/10 border-accent/30 text-accent" : "border-card-b text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"}`}>
              <Icon name={t.icon} className="text-sm" />{t.label}
            </button>
          ))}
        </div>
        <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-6 overflow-auto font-mono text-[13px] leading-[1.8] text-neutral-300 max-h-[72vh] anim-fade-up delay-1 whitespace-pre-wrap">
          {CODE[activeTab]}
        </div>
      </main>
    </>
  );
};