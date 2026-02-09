# QR-Based Multi-Restaurant Smart Ordering Platform

Phase 0 foundation for a multi-tenant restaurant ordering system.

## 1) What is in this Phase 0 setup

- Monorepo folder structure (`backend` + `frontend`)
- Base Express API + Socket.IO server
- Base React + Vite frontend with responsive UI shell
- Environment configuration templates
- Data model design document for future phases
- GitHub Actions CI workflow

## 2) Tech Stack Locked In

- Frontend: React + Vite
- Backend: Node.js + Express
- Real-time: Socket.IO
- Database: MongoDB Atlas (or local MongoDB for development)
- Auth approach: JWT (admin) + OTP verification (user)
- Payments (later phases): Stripe or Razorpay in test mode

## 3) Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas URI (or local MongoDB)
- Git + GitHub account

## 4) Project Structure

```text
restaurant_project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── docs/
│   └── phase-0-data-models.md
├── .github/workflows/ci.yml
├── .env.example
├── .gitignore
└── package.json
```

## 5) Local Development Setup (Step-by-Step)

1. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Optional one-command setup:

```bash
./scripts/setup.sh
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MongoDB URI and secrets.

4. Start backend (terminal 1):

```bash
npm run dev:backend
```

5. Start frontend (terminal 2):

```bash
npm run dev:frontend
```

6. Open:
- Frontend: `http://localhost:5173`
- Backend health API: `http://localhost:5000/api/health`

## 6) GitHub Setup (Push Workflow)

1. Initialize git:

```bash
git init
git add .
git commit -m "chore: phase 0 project foundation"
```

2. Create a new GitHub repository.

3. Connect remote and push:

```bash
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

4. For daily workflow:

```bash
git add .
git commit -m "feat: <short change description>"
git push
```

## 7) What to Build Next (Phase 1)

- Restaurant CRUD APIs
- Table CRUD APIs + QR generation hooks
- Menu CRUD APIs (scoped by restaurant)
- Frontend restaurant page to fetch and show live menu
- Basic admin menu management screen

## 8) Notes on Responsiveness and UI

The frontend base is mobile-first and responsive. Continue this pattern in every new component:

- Use fluid widths and CSS grid/flex patterns
- Avoid fixed pixel-only layouts
- Keep touch-friendly controls for mobile
- Maintain clear contrast and readable typography

## 9) Data Model Planning

See `docs/phase-0-data-models.md` for model design, relationships, required indexes, and TTL rules.
