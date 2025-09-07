@echo off
echo Iniciando aplicación Reto Renault...
echo.

echo [1/3] Activando entorno virtual Python...
call .venv\Scripts\activate.bat

echo [2/3] Iniciando servidor backend (Puerto 8000)...
start "Backend Server" cmd /k "cd backend && ..\\.venv\\Scripts\\uvicorn.exe app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [3/3] Iniciando servidor frontend (Puerto 3000)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ¡Aplicación iniciada!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
pause
