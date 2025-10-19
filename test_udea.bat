@echo off
echo Iniciando servidor backend...
cd /d "c:\Users\oscar\Downloads\UDEA\Reto_Renault\backend"
start "Backend Server" cmd /k "python app\main.py"

echo Esperando 3 segundos para que inicie el servidor...
timeout /t 3 /nobreak

echo Probando API con coordenadas de la UdeA...
curl -X POST "http://localhost:8000/api/microcontroller/data" -H "Content-Type: application/json" -d "{\"mc_id\": 1, \"timestamp\": \"2025-10-18T14:30:45\", \"lat\": 6.26701, \"lng\": -75.56859, \"speed\": 12.0, \"battery\": 95, \"status\": \"active\"}"

echo.
echo Verificando recorridos...
curl -X GET "http://localhost:8000/api/recorridos"

echo.
echo ¡Listo! Abre http://localhost:8000/docs para ver la API
pause