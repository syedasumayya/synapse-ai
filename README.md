Synapse AI — Full-Stack AI Note Management Platform
A production-grade full-stack application with a real neural network for text classification.

Tech Stack
Layer	Technology
Frontend	React 19 + TypeScript + Vite + Tailwind CSS 4
State	Zustand
Charts	Chart.js + react-chartjs-2
Backend	Python 3.11 + FastAPI + Pydantic v2
ML	scikit-learn MLPClassifier (60→32→16→6)
Database	SQLite (dev) / PostgreSQL (prod) + SQLAlchemy
Auth	JWT (python-jose) + bcrypt
Quick Start
Backend
cd backendpython -m venv venvvenv\Scripts\Activatepip install -r requirements.txtuvicorn app.main:app --reload
Frontend
bash

cd frontend
npm install
npm run dev
Open http://localhost:5173

API Docs
http://localhost:8000/docs

ML Model
Architecture: 60 input (Bag-of-Words) → 32 hidden (ReLU) → 16 hidden (ReLU) → 6 output (Softmax)
Categories: Work, Personal, Health, Finance, Learning, Creative
Training: 80+ labeled samples, early stopping, validation split
License
MIT

text


---

### Step 3: Initialize Git and Push to GitHub

```powershell
cd C:\Users\syeda\synapse-ai

# Initialize git
git init

# Add everything
git add .

# First commit
git commit -m "Initial commit: full-stack AI note management platform

- Backend: FastAPI + SQLAlchemy + scikit-learn neural network
- Frontend: React 19 + TypeScript + Tailwind CSS 4 + Zustand
- ML: Text classifier (60→32→16→6) with bag-of-words features
- Database: SQLite with ORM models
- 6 pages: Dashboard, Notes, ML Lab, Database, Architecture, Python Backend"
Now create the GitHub repo. Two options:

Option A — With GitHub CLI (if installed):

powershell

gh repo create synapse-ai --public --source=. --push