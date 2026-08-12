# 🧠 Synapse AI

## Full-Stack AI Note Management Platform

Synapse AI is a production-grade full-stack AI note management platform that combines modern web development, secure authentication, database management, analytics, and real neural-network-powered text classification into a single application.

The platform allows users to create and manage notes while using a machine learning model to automatically classify notes into meaningful categories.

---

## ✨ Features

- 🤖 AI-powered note management
- 🧠 Real neural network text classification
- 🏷️ Automatic note categorization
- 🔐 JWT-based authentication
- 🔒 Secure password hashing with bcrypt
- 📊 Analytics dashboard
- 🧪 Interactive ML Lab
- 🗄️ Database management
- 🏗️ Architecture visualization
- 📚 Interactive API documentation
- 📈 Interactive data visualization
- ⚡ FastAPI REST API
- 📱 Responsive modern interface
- 🔌 Frontend and backend separation

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Zustand
- Chart.js
- react-chartjs-2

### Backend

- Python 3.11
- FastAPI
- Pydantic v2
- SQLAlchemy
- JWT
- python-jose
- bcrypt

### Machine Learning

- scikit-learn
- MLPClassifier
- Bag-of-Words
- Multi-Layer Perceptron
- ReLU activation
- Softmax output
- Validation split
- Early stopping

### Database

- SQLite for development
- PostgreSQL for production
- SQLAlchemy ORM

---

## 🤖 Machine Learning Model

Synapse AI uses a **Multi-Layer Perceptron (MLP)** neural network for automatic text classification.

The model analyzes note content and predicts the most relevant category based on the text.

### Model Architecture

```text
Input Text
     ↓
Text Preprocessing
     ↓
Bag-of-Words
     ↓
60 Input Features
     ↓
32 Hidden Neurons
     ↓
ReLU
     ↓
16 Hidden Neurons
     ↓
ReLU
     ↓
6 Output Neurons
     ↓
Softmax
     ↓
Predicted Category
```

### Model Configuration

| Component | Configuration |
|---|---|
| Feature Extraction | Bag-of-Words |
| Input Features | 60 |
| Hidden Layer 1 | 32 neurons |
| Activation | ReLU |
| Hidden Layer 2 | 16 neurons |
| Activation | ReLU |
| Output Layer | 6 neurons |
| Output Activation | Softmax |
| Model | MLPClassifier |
| Training Samples | 80+ |
| Validation | Validation Split |
| Optimization | Early Stopping |

### Classification Categories

| Category | Description |
|---|---|
| 💼 **Work** | Projects, meetings, tasks, and professional activities |
| 👤 **Personal** | Personal thoughts, activities, and daily life |
| ❤️ **Health** | Health, fitness, wellness, and medical-related notes |
| 💰 **Finance** | Expenses, budgets, savings, and financial planning |
| 📚 **Learning** | Study, research, courses, and educational content |
| 🎨 **Creative** | Ideas, writing, brainstorming, and creative work |

---

## 🧪 Machine Learning Pipeline

```text
Training Dataset
       ↓
Data Preparation
       ↓
Text Preprocessing
       ↓
Bag-of-Words Vectorization
       ↓
Feature Extraction
       ↓
Train / Validation Split
       ↓
MLPClassifier
       ↓
Neural Network Training
       ↓
Validation
       ↓
Early Stopping
       ↓
Trained Model
       ↓
Text Prediction
       ↓
Category + Probability
```

---

## 🤖 AI Classification Example

### Input

```text
Prepare the monthly financial report and review expenses.
```

### Processing

```text
Input Text
    ↓
Text Processing
    ↓
Bag-of-Words
    ↓
Neural Network
    ↓
Classification
    ↓
Category Probabilities
```

### Example Prediction

```text
Finance      → 0.87
Work         → 0.09
Learning     → 0.02
Personal     → 0.01
Health       → 0.01
Creative     → 0.00
```

### Result

```text
Predicted Category: Finance
```

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│               React Frontend                │
│                                              │
│ React + TypeScript + Vite + Tailwind CSS    │
│                    +                         │
│                  Zustand                     │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│              FastAPI Backend                │
│                                              │
│ FastAPI + Pydantic + SQLAlchemy             │
│                    +                         │
│                 JWT Auth                     │
└──────────────────────┬───────────────────────┘
                       │
              ┌────────┴─────────┐
              │                  │
              ▼                  ▼
     ┌────────────────┐  ┌──────────────────┐
     │    Database    │  │    ML Model      │
     │                │  │                  │
     │ SQLite /       │  │ Bag-of-Words     │
     │ PostgreSQL     │  │       ↓          │
     │                │  │ MLPClassifier    │
     └────────────────┘  └──────────────────┘
```

---

## 🔄 Application Flow

```text
User
  ↓
React Frontend
  ↓
FastAPI REST API
  ↓
Authentication
  ↓
Notes Service
  ↓
Database + ML Classifier
  ↓
Prediction / Data
  ↓
React Frontend
```

---

## 📂 Project Structure

```text
synapse-ai/
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── ml/
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── store/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## Prerequisites

Before running Synapse AI, make sure the following are installed:

- Python 3.11+
- Node.js 18+
- npm
- Git

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/syedasumayya/synapse-ai.git
cd synapse-ai
```

---

## 🔧 Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start FastAPI Server

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

---

## 💻 Frontend Setup

Open a new terminal.

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

# 🔐 Authentication

Synapse AI uses **JWT-based authentication** to protect user accounts and API resources.

## Authentication Flow

```text
User
  ↓
Register / Login
  ↓
Password Verification
  ↓
JWT Token Generated
  ↓
Authenticated API Request
  ↓
Protected API Endpoint
```

## Security Features

- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Token-based authorization
- Pydantic request validation
- SQLAlchemy database abstraction

---

# 🗄️ Database

## Development

Synapse AI uses **SQLite** during development.

```text
SQLite
```

SQLite provides a lightweight database suitable for local development and testing.

## Production

For production environments, PostgreSQL is recommended.

```text
PostgreSQL
```

## ORM

The backend uses **SQLAlchemy** as the ORM layer.

SQLAlchemy provides a clean abstraction between application logic and database operations.

---

# 📊 Dashboard

The dashboard provides a centralized overview of notes and AI classification activity.

## Dashboard Features

- 📈 Total notes
- 📝 Recent notes
- 🏷️ Notes by category
- 🤖 AI classification statistics
- 📊 Category distribution
- 📉 Interactive charts
- 📌 Recent activity

## Charting Libraries

- Chart.js
- react-chartjs-2

---

# 🧪 ML Lab

The **ML Lab** provides an interactive interface for exploring the machine learning system.

## ML Lab Features

- Text classification
- AI predictions
- Category probabilities
- Neural network architecture
- Model training information
- Model performance
- Classification results

The ML Lab makes the machine learning component visible and interactive rather than keeping it hidden inside the backend.

---

# 📄 Application Pages

## 🏠 Dashboard

Provides an overview of notes, categories, statistics, and AI classification activity.

## 📝 Notes

Allows users to create, manage, organize, and classify notes using AI.

## 🧪 ML Lab

Provides access to model predictions, category probabilities, neural network architecture, and training information.

## 🗄️ Database

Provides database-related information and management functionality.

## 🏗️ Architecture

Provides a visual representation of the system architecture and application components.

## 🐍 Python Backend

Provides information about the FastAPI backend, API routes, services, authentication, database layer, and machine learning components.

---

# 🔌 API Flow

```text
                    User
                      ↓
              React Frontend
                      ↓
             FastAPI REST API
                      ↓
                Authentication
                      ↓
                Notes Service
                      ↓
              ┌───────┴───────┐
              ↓               ↓
          Database      ML Classifier
              ↓               ↓
              └───────┬───────┘
                      ↓
              Prediction / Data
                      ↓
               React Frontend
```

---

# 📈 Analytics

Synapse AI provides visual insights into user notes and AI classification activity.

## Analytics Include

- Total number of notes
- Notes by category
- Category distribution
- AI classification statistics
- Recent activity
- Prediction results
- Classification trends

---

# 🎯 Project Goals

Synapse AI demonstrates the integration of modern software engineering and artificial intelligence concepts.

## Key Areas

- Full-stack development
- REST API architecture
- Secure authentication
- Database management
- Machine learning
- Neural networks
- Text classification
- Data visualization
- State management
- API integration
- Modern frontend development
- Production-oriented backend architecture
- 
---


# 🛡️ Security

Security is an important part of the Synapse AI architecture.

## Implemented Security

- JWT authentication
- bcrypt password hashing
- Protected API endpoints
- Pydantic input validation
- SQLAlchemy database abstraction
- Environment-based configuration
- Separation of frontend and backend services

---

# ⚡ Performance & Scalability

Synapse AI is structured with performance, maintainability, and future scalability in mind.

## Performance Considerations

- FastAPI REST API
- Lightweight ML inference
- Efficient database operations
- Client-side state management with Zustand
- Component-based React architecture
- Modular backend services

## Scalability Roadmap

```text
SQLite
  ↓
PostgreSQL
  ↓
Docker
  ↓
Cloud Deployment
  ↓
CI/CD
  ↓
Scalable AI Infrastructure
```

---

# 🌐 Deployment

Synapse AI can be deployed using a modern full-stack deployment architecture.

## Frontend

Possible deployment platforms:

- Vercel
- Netlify
- Cloudflare Pages

## Backend

Possible deployment platforms:

- Railway
- Render
- AWS
- Microsoft Azure
- Google Cloud

## Database

Recommended production database:

```text
PostgreSQL
```

---

# 🧪 Testing

The application can be extended with automated testing across the frontend, backend, API, and machine learning components.

## Backend Testing

Recommended tools:

- Pytest
- FastAPI TestClient
- HTTPX

## Frontend Testing

Recommended tools:

- Vitest
- React Testing Library

## API Testing

Recommended tools:

- Postman
- Swagger UI

---

# 📌 Project Highlights

| Area | Implementation |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| UI | Tailwind CSS 4 |
| State Management | Zustand |
| Backend | FastAPI + Python 3.11 |
| Database | SQLite / PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT + bcrypt |
| Machine Learning | scikit-learn MLPClassifier |
| NLP | Bag-of-Words |
| Visualization | Chart.js |
| API Documentation | Swagger UI + ReDoc |
| Architecture | Full-Stack REST API |

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you find **Synapse AI** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

## 🧠 Synapse AI

### AI-Powered Note Management with Neural Network Classification

Built with ❤️ by **Syeda Sumayya**

</div>
