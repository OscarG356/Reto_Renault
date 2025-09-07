#!/bin/bash

echo "Iniciando aplicación Reto Renault..."
echo

echo "[1/3] Activando entorno virtual Python..."
source .venv/bin/activate

echo "[2/3] Iniciando servidor backend (Puerto 8000)..."
cd backend
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

sleep 3

echo "[3/3] Iniciando servidor frontend (Puerto 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "¡Aplicación iniciada!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo
echo "Presiona Ctrl+C para detener los servidores"

# Función para limpiar procesos al salir
cleanup() {
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT

# Esperar hasta que el usuario presione Ctrl+C
wait
