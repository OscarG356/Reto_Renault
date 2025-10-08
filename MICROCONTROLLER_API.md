# 📡 FORMATO DE DATOS PARA MICROCONTROLADOR

## ================================================

## 🔧 ESPECIFICACIONES TÉCNICAS

### **Protocolo:** HTTP POST JSON

### **Frecuencia:** 30-60 segundos

### **Tamaño:** ~100-200 bytes por mensaje

### **Compresión:** Opcional (gzip)

## 📨 FORMATO 1: ENVÍO INDIVIDUAL (Recomendado para tiempo real)

### **URL:** `POST /api/microcontroller/data`

```json
{
  "mc_id": 1,
  "timestamp": "2025-09-07T14:30:45",
  "lat": 40.7128,
  "lng": -74.0060,
  "speed": 15.5,
  "battery": 85,
  "status": "active"
}
```

### **Campos:**

- `mc_id`: ID del montacarga (entero, requerido)
- `timestamp`: Timestamp ISO format (string, requerido)
- `lat`: Latitud GPS (float, -90 a 90, requerido)
- `lng`: Longitud GPS (float, -180 a 180, requerido)
- `speed`: Velocidad en km/h (float, opcional, default: 0)
- `battery`: Nivel batería 0-100% (int, opcional, default: 100)
- `status`: Estado del montacarga (string, opcional, default: "active")

### **Valores de status:**

- `"active"`: Operando normalmente
- `"idle"`: Detenido/inactivo
- `"maintenance"`: En mantenimiento
- `"charging"`: Cargando batería
- `"error"`: Error/avería

## 📦 FORMATO 2: ENVÍO EN LOTE (Para conexiones intermitentes)

### **URL:** `POST /api/microcontroller/batch`

```json
{
  "mc_id": 1,
  "data": [
    {"t":"2025-09-07T14:30:00","lat":40.7128,"lng":-74.0060,"s":12.0,"b":85,"st":"active"},
    {"t":"2025-09-07T14:30:30","lat":40.7130,"lng":-74.0058,"s":15.5,"b":84,"st":"active"},
    {"t":"2025-09-07T14:31:00","lat":40.7132,"lng":-74.0056,"s":18.0,"b":83,"st":"active"}
  ]
}
```

### **Campos compactos en data[]:**

- `t`: timestamp (ISO string)
- `lat`: latitud (float)
- `lng`: longitud (float)
- `s`: speed en km/h (float, opcional)
- `b`: battery 0-100% (int, opcional)
- `st`: status (string, opcional)

## 🔄 RESPUESTA DEL SERVIDOR

```json
{
  "success": true,
  "message": "Datos recibidos correctamente",
  "next_upload_in": 30,
  "server_time": "2025-09-07T14:30:45.123456"
}
```

## ⚙️ CONFIGURACIÓN DEL MICROCONTROLADOR

### **URL:** `GET /api/microcontroller/config/{mc_id}`

```json
{
  "mc_id": 1,
  "upload_interval": 30,
  "batch_size": 10,
  "compression": true,
  "server_time": "2025-09-07T14:30:45.123456",
  "montacarga_info": {
    "id": 1,
    "codigo": "MC-001",
    "modelo": "Toyota 8FBN25",
    "estado": "Activo"
  }
}
```

## 💻 CÓDIGO EJEMPLO PARA MICROCONTROLADOR

### **Arduino/ESP32 (C++):**

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendGPSData(float lat, float lng, float speed, int battery) {
    HTTPClient http;
    http.begin("http://tu-servidor.com/api/microcontroller/data");
    http.addHeader("Content-Type", "application/json");
    
    // Crear JSON
    StaticJsonDocument<200> doc;
    doc["mc_id"] = 1;
    doc["timestamp"] = getCurrentTimestamp();
    doc["lat"] = lat;
    doc["lng"] = lng;
    doc["speed"] = speed;
    doc["battery"] = battery;
    doc["status"] = "active";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Enviar
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Respuesta: " + response);
    }
    
    http.end();
}
```

### **Python (Raspberry Pi/MicroPython):**

```python
import requests
import json
from datetime import datetime

def send_gps_data(mc_id, lat, lng, speed=0, battery=100, status="active"):
    url = "http://tu-servidor.com/api/microcontroller/data"
    
    data = {
        "mc_id": mc_id,
        "timestamp": datetime.now().isoformat(),
        "lat": lat,
        "lng": lng,
        "speed": speed,
        "battery": battery,
        "status": status
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Datos enviados. Próximo envío en {result['next_upload_in']}s")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

# Uso
send_gps_data(
    mc_id=1,
    lat=40.7128,
    lng=-74.0060,
    speed=15.5,
    battery=85
)
```

## 🛡️ CONSIDERACIONES DE SEGURIDAD

### **1. Autenticación (recomendada para producción):**

```json
{
  "mc_id": 1,
  "api_key": "tu-api-key-secreta",
  "timestamp": "2025-09-07T14:30:45",
  "lat": 40.7128,
  "lng": -74.0060
}
```

### **2. Rate Limiting:**

- Máximo 1 request por segundo por montacarga
- Máximo 100 requests por hora por montacarga

### **3. Validación:**

- Coordenadas GPS válidas
- Timestamps no más antiguos que 24 horas
- Velocidades realistas (0-50 km/h para montacargas)

## 📊 OPTIMIZACIONES PARA MICROCONTROLADOR

### **1. Reducir consumo de datos:**

```json
{"mc":1,"t":"2025-09-07T14:30:45","p":[40.7128,-74.0060],"s":15.5,"b":85}
```

### **2. Compresión gzip:**

```cpp
// Comprimir JSON antes de enviar
// Puede reducir el tamaño 60-80%
```

### **3. Buffer offline:**

```python
# Almacenar datos cuando no hay conexión
offline_buffer = []

if not internet_available():
    offline_buffer.append(gps_data)
else:
    # Enviar buffer completo
    send_batch_data(offline_buffer)
    offline_buffer.clear()
```

## 🔧 TESTING

### **Comando cURL para pruebas:**

```bash
curl -X POST "http://localhost:8000/api/microcontroller/data" \
  -H "Content-Type: application/json" \
  -d '{
    "mc_id": 1,
    "timestamp": "2025-09-07T14:30:45",
    "lat": 40.7128,
    "lng": -74.0060,
    "speed": 15.5,
    "battery": 85,
    "status": "active"
  }'
```

### **Respuesta esperada:**

```json
{
  "success": true,
  "message": "Datos recibidos correctamente",
  "next_upload_in": 30,
  "server_time": "2025-09-07T14:30:45.123456"
}
```
