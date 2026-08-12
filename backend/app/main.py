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
    classifier.predict("initialization check")
    print(f"\n  {settings.APP_NAME} v{settings.APP_VERSION} ready")
    print(f"  API: http://localhost:8000")
    print(f"  Docs: http://localhost:8000/docs\n")
    yield
    print(f"\n  {settings.APP_NAME} shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered note management platform with neural network classification",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)
app.include_router(ml.router)
app.include_router(auth.router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}