#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Installing backend dependencies..."
npm install --prefix backend

echo "[2/4] Installing frontend dependencies..."
npm install --prefix frontend

echo "[3/4] Creating env files if missing..."
[ -f backend/.env ] || cp backend/.env.example backend/.env
[ -f frontend/.env ] || cp frontend/.env.example frontend/.env

echo "[4/4] Setup completed."
echo "Run backend:  npm run dev:backend"
echo "Run frontend: npm run dev:frontend"
