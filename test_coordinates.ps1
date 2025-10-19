# 🎓 Script PowerShell para cargar coordenadas de prueba - Universidad de Antioquia

# Función para enviar coordenadas
function Send-GPS {
    param(
        [int]$mcId,
        [double]$lat,
        [double]$lng,
        [double]$speed = 15.0,
        [int]$battery = 90,
        [string]$ubicacion = ""
    )
    
    $timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    
    $body = @{
        mc_id = $mcId
        timestamp = $timestamp
        lat = $lat
        lng = $lng
        speed = $speed
        battery = $battery
        status = "active"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/microcontroller/data" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ [$ubicacion] Coordenadas enviadas: lat=$lat, lng=$lng" -ForegroundColor Green
        Write-Host "   Respuesta: $($response.message)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "❌ Error enviando coordenadas para $ubicacion : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🎓 CARGANDO COORDENADAS DE LA UNIVERSIDAD DE ANTIOQUIA - MEDELLÍN" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# 🚚 MONTACARGA MC-001 - RECORRIDO POR INGENIERÍA
Write-Host "`n🚚 Montacargas MC-001: Recorrido por Facultad de Ingeniería..." -ForegroundColor Yellow

Send-GPS -mcId 1 -lat 6.26701 -lng -75.56859 -speed 8.0 -battery 95 -ubicacion "Entrada Principal UdeA"
Start-Sleep -Seconds 3
Send-GPS -mcId 1 -lat 6.26723 -lng -75.56901 -speed 12.0 -battery 94 -ubicacion "Biblioteca Central"
Start-Sleep -Seconds 3
Send-GPS -mcId 1 -lat 6.26756 -lng -75.56825 -speed 15.0 -battery 92 -ubicacion "Bloque 21 - Ingeniería"
Start-Sleep -Seconds 3
Send-GPS -mcId 1 -lat 6.26789 -lng -75.56756 -speed 10.0 -battery 90 -ubicacion "Laboratorios Ingeniería"
Start-Sleep -Seconds 3
Send-GPS -mcId 1 -lat 6.26812 -lng -75.56698 -speed 6.0 -battery 89 -ubicacion "Bloque 19 - Investigación"

# 🔋 MONTACARGA MC-002 - RECORRIDO CULTURAL
Write-Host "`n🔋 Montacargas MC-002: Recorrido por Área Cultural..." -ForegroundColor Cyan

Send-GPS -mcId 2 -lat 6.26623 -lng -75.56978 -speed 14.0 -battery 88 -ubicacion "Parqueadero Principal"
Start-Sleep -Seconds 3
Send-GPS -mcId 2 -lat 6.26656 -lng -75.57012 -speed 16.0 -battery 86 -ubicacion "Auditorio Principal"
Start-Sleep -Seconds 3
Send-GPS -mcId 2 -lat 6.26689 -lng -75.57045 -speed 18.0 -battery 84 -ubicacion "Teatro Universitario"
Start-Sleep -Seconds 3
Send-GPS -mcId 2 -lat 6.26712 -lng -75.57089 -speed 13.0 -battery 82 -ubicacion "Museo Universitario"
Start-Sleep -Seconds 3
Send-GPS -mcId 2 -lat 6.26734 -lng -75.57123 -speed 11.0 -battery 81 -ubicacion "Jardín Botánico"
Start-Sleep -Seconds 3
Send-GPS -mcId 2 -lat 6.26778 -lng -75.57189 -speed 9.0 -battery 79 -ubicacion "Extensión Cultural"

# 🧪 MONTACARGA MC-003 - RECORRIDO CIENCIAS
Write-Host "`n🧪 Montacargas MC-003: Recorrido por Ciencias Exactas..." -ForegroundColor Green

Send-GPS -mcId 3 -lat 6.26578 -lng -75.56734 -speed 17.0 -battery 93 -ubicacion "Facultad de Ciencias Exactas"
Start-Sleep -Seconds 3
Send-GPS -mcId 3 -lat 6.26601 -lng -75.56689 -speed 19.0 -battery 91 -ubicacion "Laboratorios de Física"
Start-Sleep -Seconds 3
Send-GPS -mcId 3 -lat 6.26634 -lng -75.56612 -speed 14.0 -battery 89 -ubicacion "Instituto de Matemáticas"
Start-Sleep -Seconds 3
Send-GPS -mcId 3 -lat 6.26667 -lng -75.56567 -speed 16.0 -battery 87 -ubicacion "Centro de Cómputo"
Start-Sleep -Seconds 3
Send-GPS -mcId 3 -lat 6.26689 -lng -75.56523 -speed 12.0 -battery 85 -ubicacion "Laboratorios de Química"
Start-Sleep -Seconds 3
Send-GPS -mcId 3 -lat 6.26734 -lng -75.56434 -speed 8.0 -battery 83 -ubicacion "Laboratorios Biotecnología"

Write-Host "`n🎉 ¡COORDENADAS DE LA UdeA CARGADAS EXITOSAMENTE!" -ForegroundColor Green
Write-Host "📍 Datos cargados para Ciudad Universitaria, Medellín" -ForegroundColor Green
Write-Host "🌐 Abre http://localhost:3000 para ver el dashboard con los recorridos" -ForegroundColor Cyan
Write-Host "📊 Revisa http://localhost:8000/docs para la documentación de la API" -ForegroundColor Cyan