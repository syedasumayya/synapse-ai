from fastapi import APIRouter
from app.schemas.note import PredictRequest, PredictResponse, ModelInfoResponse
from app.ml import classifier

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])


@router.post("/predict", response_model=PredictResponse)
def predict_text(req: PredictRequest):
    result = classifier.predict(req.text)
    return PredictResponse(**result)


@router.post("/predict/batch")
def predict_batch(texts: list[str]):
    results = classifier.predict_batch(texts)
    return {"predictions": results}


@router.get("/model-info", response_model=ModelInfoResponse)
def get_model_info():
    info = classifier.get_model_info()
    return ModelInfoResponse(**info)


@router.post("/retrain")
def retrain_model():
    classifier.retrain()
    return {"status": "retrained", "info": classifier.get_model_info()}