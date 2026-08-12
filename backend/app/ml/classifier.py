import json
import re
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from joblib import dump, load
from pathlib import Path
from typing import Optional

from app.ml.vocabulary import VOCABULARY, CATEGORIES, PRIORITY_KEYWORDS
from app.ml.training_data import TRAINING_DATA
from app.core.config import settings


class TextClassifier:

    def __init__(self):
        self.vectorizer = CountVectorizer(vocabulary=VOCABULARY, binary=True)
        self.encoder = LabelEncoder()
        self.model: Optional[MLPClassifier] = None
        self._trained = False

    def train(self, data=None):
        if data is None:
            data = TRAINING_DATA
        texts = [d["text"] for d in data]
        labels = [d["category"] for d in data]
        X = self.vectorizer.fit_transform(texts).toarray()
        y = self.encoder.fit_transform(labels)
        self.model = MLPClassifier(
            hidden_layer_sizes=(32, 16),
            activation="relu",
            solver="adam",
            max_iter=500,
            learning_rate_init=0.05,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.15,
            n_iter_no_change=20,
        )
        self.model.fit(X, y)
        self._trained = True
        self._save()

    def predict(self, text: str) -> dict:
        if not self._trained:
            self._load()
            if not self._trained:
                self.train()
        X = self.vectorizer.transform([text]).toarray()
        probs = self.model.predict_proba(X)[0]
        cat_idx = int(np.argmax(probs))
        category = self.encoder.classes_[cat_idx]
        confidence = float(probs[cat_idx])
        return {
            "category": category,
            "confidence": round(confidence, 4),
            "probabilities": {
                cat: round(float(probs[i]), 4)
                for i, cat in enumerate(self.encoder.classes_)
            },
            "priority": self._estimate_priority(text),
            "tags": self._extract_tags(text),
        }

    def predict_batch(self, texts: list) -> list:
        if not self._trained:
            self._load()
            if not self._trained:
                self.train()
        X = self.vectorizer.transform(texts).toarray()
        probs = self.model.predict_proba(X)
        results = []
        for i in range(len(texts)):
            cat_idx = int(np.argmax(probs[i]))
            results.append({
                "category": self.encoder.classes_[cat_idx],
                "confidence": round(float(probs[i][cat_idx]), 4),
                "priority": self._estimate_priority(texts[i]),
                "tags": self._extract_tags(texts[i]),
            })
        return results

    def get_model_info(self) -> dict:
        if not self._trained:
            self._load()
        if not self.model:
            return {"trained": False}
        loss_curve = self.model.loss_curve_.tolist() if hasattr(self.model, "loss_curve_") else []
        val_score = float(self.model.best_validation_score_) if hasattr(self.model, "best_validation_score_") else None
        n_iter = int(self.model.n_iter_) if hasattr(self.model, "n_iter_") else 0
        return {
            "trained": True,
            "architecture": "60 -> 32 -> 16 -> 6",
            "vocabularySize": len(VOCABULARY),
            "categories": list(self.encoder.classes_),
            "trainingSamples": len(TRAINING_DATA),
            "lossCurve": loss_curve,
            "bestValidationScore": val_score,
            "nIter": n_iter,
        }

    def retrain(self, extra_data=None):
        data = list(TRAINING_DATA)
        if extra_data:
            data.extend(extra_data)
        self.train(data)

    def _estimate_priority(self, text: str) -> str:
        words = set(text.lower().split())
        scores = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        for priority, keywords in PRIORITY_KEYWORDS.items():
            for kw in keywords:
                if kw in words:
                    scores[priority] += 1
        if scores["Critical"] >= 2:
            return "Critical"
        if scores["High"] >= 1:
            return "High"
        if scores["Medium"] >= 1:
            return "Medium"
        return "Low"

    def _extract_tags(self, text: str) -> list:
        cleaned = re.sub(r"[^a-z\s]", "", text.lower())
        words = set(cleaned.split())
        return sorted(set(VOCABULARY) & words)[:5]

    def _save(self):
        Path(settings.MODEL_PATH).parent.mkdir(parents=True, exist_ok=True)
        dump(self.model, settings.MODEL_PATH)
        with open(settings.VOCAB_PATH, "w") as f:
            json.dump({
                "vocabulary": VOCABULARY,
                "categories": self.encoder.classes_.tolist(),
            }, f)

    def _load(self):
        model_file = Path(settings.MODEL_PATH)
        if model_file.exists():
            self.model = load(model_file)
            with open(settings.VOCAB_PATH) as f:
                data = json.load(f)
            self.encoder.classes_ = np.array(data["categories"])
            self._trained = True


classifier = TextClassifier()