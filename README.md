# LinkOS 🚀
### AI-Powered Startup Ecosystem Platform for Cradle Fund Malaysia

> "The system that never forgets."

LinkOS helps Cradle Fund programme managers evaluate hundreds 
of startup applications instantly using AI, match founders 
with the right mentors, and learn from every cohort.

---

## 🎯 The Problem
Cradle Fund receives 800+ startup applications per cohort.
- Managers spend 3 weeks reading applications manually
- Mentor matching is done from memory
- Every cohort starts from zero — nothing is remembered

## ✅ The Solution
LinkOS automates the entire pipeline:
1. Founders apply once — profile saved forever
2. AI scores all applications in seconds
3. System matches founders with best mentors
4. Memory panel learns from every cohort

---

## 🏗️ Architecture

Frontend (React + Vite) → Backend (Node.js + Express) → Agent (Python + FastAPI + Gemini AI) → PostgreSQL

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL |
| AI Agent | Python, FastAPI, Google Gemini |
| ORM | Prisma |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/founders | Save new founder profile |
| GET | /api/founders | Get all founders with scores |
| GET | /api/founders/:id/score | Get AI score for founder |
| POST | /api/applications/batch | Trigger AI scoring |
| GET | /api/applications/:batch_id/status | Check scoring status |
| GET | /api/mentors | Get all mentors |
| POST | /api/mentors | Add new mentor |
| POST | /api/linkages | Approve mentor match |
| GET | /api/linkages | Get all matches |
| GET | /api/memory | Get cohort patterns + utilisation |
| POST | /api/memory/patterns | Save detected pattern |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/h16147317-code/linkos.git
cd linkos

# Backend setup
cd backend
npm install
copy .env.example .env
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Agent setup
cd ../agent
pip install -r requirements.txt
echo GOOGLE_API_KEY=your_key_here > .env
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### Access the app
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Agent: http://localhost:8000

---

## 👥 Team

| Role | Name | Contact |
|---|---|---|
| Backend | Hamza Mohamed | [LinkedIn](https://www.linkedin.com/in/hamza-mohamed-93b110405/) |
| Agent | Benjamin Kaggwa | [LinkedIn](https://www.linkedin.com/in/benjamin-kaggwa-a902b4283/) |
| Frontend | Finlay Shayo | [LinkedIn](https://www.linkedin.com/in/finlay-shayo-76171a366/) |

---

## 🏆 Built for
Google Cloud x Cradle Fund Hackathon 2026
