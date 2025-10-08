from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uvicorn
import os
import json
import requests

# Crear la instancia de FastAPI
app = FastAPI(
    title="Reto Renault API",
    description="API backend para la aplicación Reto Renault",
    version="1.0.0"
)

# ========== PROXY SEGURO PARA GOOGLE MAPS (OPCIONAL) ==========

@app.get("/api/maps/script")
async def get_maps_script():
    """
    Endpoint proxy para servir el script de Google Maps sin exponer la API key
    Alternativa más segura que cargar directamente desde el frontend
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="Google Maps API key no configurada en el servidor"
        )
    
    script_url = f"https://maps.googleapis.com/maps/api/js?key={api_key}&libraries=geometry"
    
    return {
        "success": True,
        "script_url": script_url,
        "message": "Script URL generada dinámicamente",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/maps/geocode")
async def proxy_geocoding(address: str):
    """
    Proxy para geocoding sin exponer la API key
    Uso: POST /api/maps/geocode con {"address": "dirección a geocodificar"}
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Google Maps API key no configurada"
        )
    
    try:
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": address,
            "key": api_key
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
        
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en geocoding: {str(e)}"
        )

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float

class ItemCreate(BaseModel):
    name: str
    description: str
    price: float

class Montacarga(BaseModel):
    id: int
    codigo: str
    modelo: str
    estado: str

class PuntoRecorrido(BaseModel):
    lat: float
    lng: float
    timestamp: str

class Recorrido(BaseModel):
    id: int
    montacarga_id: int
    fecha: str
    hora_inicio: str
    hora_fin: str
    distancia_km: float
    puntos_recorrido: List[PuntoRecorrido]

# ========== MODELOS PARA MICROCONTROLADOR ==========

class MicrocontrollerData(BaseModel):
    """Modelo compacto para datos del microcontrolador"""
    mc_id: int = Field(..., description="ID del montacarga")
    timestamp: str = Field(..., description="ISO timestamp: YYYY-MM-DDTHH:MM:SS")
    lat: float = Field(..., ge=-90, le=90, description="Latitud (-90 a 90)")
    lng: float = Field(..., ge=-180, le=180, description="Longitud (-180 a 180)")
    speed: Optional[float] = Field(0.0, ge=0, description="Velocidad en km/h")
    battery: Optional[int] = Field(100, ge=0, le=100, description="Batería 0-100%")
    status: Optional[str] = Field("active", description="Estado: active|idle|maintenance")

class MicrocontrollerBatch(BaseModel):
    """Para envío en lotes (más eficiente)"""
    mc_id: int = Field(..., description="ID del montacarga")
    data: List[dict] = Field(..., description="Lista de puntos GPS compactos")
    # Formato data: [{"t":"2025-09-07T14:30:00","lat":40.7128,"lng":-74.0060,"s":15.5,"b":85}]

class MicrocontrollerResponse(BaseModel):
    """Respuesta del servidor al microcontrolador"""
    success: bool
    message: str
    next_upload_in: int = Field(60, description="Segundos hasta próximo envío")
    server_time: str

# Datos de ejemplo (en una aplicación real usarías una base de datos)
items_db = [
    {"id": 1, "name": "Producto 1", "description": "Descripción del producto 1", "price": 29.99},
    {"id": 2, "name": "Producto 2", "description": "Descripción del producto 2", "price": 39.99},
]

# Datos de montacargas
montacargas_db = [
    {"id": 1, "codigo": "MC-001", "modelo": "Toyota 8FBN25", "estado": "Activo"},
    {"id": 2, "codigo": "MC-002", "modelo": "Caterpillar DP25N", "estado": "Mantenimiento"},
    {"id": 3, "codigo": "MC-003", "modelo": "Hyundai 25D-7E", "estado": "Activo"}
]

# Datos de recorridos
recorridos_db = [
    {
        "id": 1,
        "montacarga_id": 1,
        "fecha": "2025-09-07",
        "hora_inicio": "08:00",
        "hora_fin": "08:45",
        "distancia_km": 2.5,
        "puntos_recorrido": [
            {"lat": 40.7128, "lng": -74.0060, "timestamp": "08:00"},
            {"lat": 40.7130, "lng": -74.0058, "timestamp": "08:15"},
            {"lat": 40.7135, "lng": -74.0055, "timestamp": "08:30"},
            {"lat": 40.7140, "lng": -74.0050, "timestamp": "08:45"}
        ]
    },
    {
        "id": 2,
        "montacarga_id": 1,
        "fecha": "2025-09-07",
        "hora_inicio": "09:00",
        "hora_fin": "10:30",
        "distancia_km": 4.2,
        "puntos_recorrido": [
            {"lat": 40.7140, "lng": -74.0050, "timestamp": "09:00"},
            {"lat": 40.7145, "lng": -74.0045, "timestamp": "09:30"},
            {"lat": 40.7150, "lng": -74.0040, "timestamp": "10:00"},
            {"lat": 40.7155, "lng": -74.0035, "timestamp": "10:30"}
        ]
    },
    {
        "id": 3,
        "montacarga_id": 2,
        "fecha": "2025-09-07",
        "hora_inicio": "07:30",
        "hora_fin": "09:15",
        "distancia_km": 3.8,
        "puntos_recorrido": [
            {"lat": 40.7160, "lng": -74.0030, "timestamp": "07:30"},
            {"lat": 40.7165, "lng": -74.0025, "timestamp": "08:00"},
            {"lat": 40.7170, "lng": -74.0020, "timestamp": "08:30"},
            {"lat": 40.7175, "lng": -74.0015, "timestamp": "09:15"}
        ]
    }
]

# Rutas de la API
@app.get("/")
async def root():
    return {"message": "¡Bienvenido a la API de Reto Renault!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API funcionando correctamente"}

@app.get("/api/items", response_model=List[Item])
async def get_items():
    return items_db

@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in items_db:
        if item["id"] == item_id:
            return item
    return {"error": "Item no encontrado"}

@app.post("/api/items", response_model=Item)
async def create_item(item: ItemCreate):
    new_id = max([item["id"] for item in items_db]) + 1 if items_db else 1
    new_item = {"id": new_id, **item.dict()}
    items_db.append(new_item)
    return new_item

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    for i, item in enumerate(items_db):
        if item["id"] == item_id:
            deleted_item = items_db.pop(i)
            return {"message": f"Item {item_id} eliminado", "item": deleted_item}
    return {"error": "Item no encontrado"}

# Nuevas rutas para el dashboard de montacargas
@app.get("/api/montacargas", response_model=List[Montacarga])
async def get_montacargas():
    return montacargas_db

@app.get("/api/montacargas/{montacarga_id}", response_model=Montacarga)
async def get_montacarga(montacarga_id: int):
    for montacarga in montacargas_db:
        if montacarga["id"] == montacarga_id:
            return montacarga
    return {"error": "Montacarga no encontrado"}

@app.get("/api/recorridos", response_model=List[Recorrido])
async def get_recorridos():
    return recorridos_db

@app.get("/api/recorridos/montacarga/{montacarga_id}", response_model=List[Recorrido])
async def get_recorridos_by_montacarga(montacarga_id: int):
    return [r for r in recorridos_db if r["montacarga_id"] == montacarga_id]

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    total_recorridos = len(recorridos_db)
    distancia_total = sum(r["distancia_km"] for r in recorridos_db)
    
    # Calcular tiempo total
    tiempo_total = 0
    for rec in recorridos_db:
        inicio = rec["hora_inicio"].split(":")
        fin = rec["hora_fin"].split(":")
        tiempo_inicio = int(inicio[0]) * 60 + int(inicio[1])
        tiempo_fin = int(fin[0]) * 60 + int(fin[1])
        tiempo_total += tiempo_fin - tiempo_inicio
    
    velocidad_promedio = (distancia_total / (tiempo_total / 60)) if tiempo_total > 0 else 0
    
    return {
        "total_recorridos": total_recorridos,
        "distancia_total": round(distancia_total, 2),
        "tiempo_total": tiempo_total,
        "velocidad_promedio": round(velocidad_promedio, 2),
        "montacargas_activos": len([m for m in montacargas_db if m["estado"] == "Activo"]),
        "montacargas_mantenimiento": len([m for m in montacargas_db if m["estado"] == "Mantenimiento"])
    }

# ========== ENDPOINTS PARA MICROCONTROLADOR ==========

@app.post("/api/microcontroller/data", response_model=MicrocontrollerResponse)
async def receive_microcontroller_data(data: MicrocontrollerData):
    """
    Endpoint optimizado para recibir datos del microcontrolador
    Formato JSON compacto y respuesta rápida
    """
    try:
        # Validar que el montacarga existe
        montacarga_exists = any(m["id"] == data.mc_id for m in montacargas_db)
        if not montacarga_exists:
            raise HTTPException(status_code=404, detail=f"Montacarga {data.mc_id} no encontrado")
        
        # Crear punto de recorrido
        nuevo_punto = {
            "lat": data.lat,
            "lng": data.lng,
            "timestamp": data.timestamp
        }
        
        # Buscar recorrido activo del día o crear uno nuevo
        fecha_hoy = data.timestamp.split('T')[0]
        recorrido_activo = None
        
        for rec in recorridos_db:
            if rec["montacarga_id"] == data.mc_id and rec["fecha"] == fecha_hoy:
                recorrido_activo = rec
                break
        
        if not recorrido_activo:
            # Crear nuevo recorrido
            nuevo_recorrido = {
                "id": len(recorridos_db) + 1,
                "montacarga_id": data.mc_id,
                "fecha": fecha_hoy,
                "hora_inicio": data.timestamp.split('T')[1][:5],
                "hora_fin": data.timestamp.split('T')[1][:5],
                "distancia_km": 0.0,
                "puntos_recorrido": [nuevo_punto],
                "tiempo_minutos": 0,
                "velocidad_actual": data.speed or 0,
                "bateria": data.battery or 100,
                "estado": data.status or "active"
            }
            recorridos_db.append(nuevo_recorrido)
        else:
            # Actualizar recorrido existente
            recorrido_activo["puntos_recorrido"].append(nuevo_punto)
            recorrido_activo["hora_fin"] = data.timestamp.split('T')[1][:5]
            
            # Calcular distancia aproximada (simplificada)
            if len(recorrido_activo["puntos_recorrido"]) > 1:
                puntos = recorrido_activo["puntos_recorrido"]
                ultimo = puntos[-2]
                actual = puntos[-1]
                # Fórmula simplificada de distancia
                dist_aprox = ((actual["lat"] - ultimo["lat"])**2 + (actual["lng"] - ultimo["lng"])**2)**0.5 * 111
                recorrido_activo["distancia_km"] += dist_aprox
        
        # Actualizar estado del montacarga
        for montacarga in montacargas_db:
            if montacarga["id"] == data.mc_id:
                if data.status == "maintenance":
                    montacarga["estado"] = "Mantenimiento"
                else:
                    montacarga["estado"] = "Activo"
                break
        
        return MicrocontrollerResponse(
            success=True,
            message="Datos recibidos correctamente",
            next_upload_in=30,  # Próximo envío en 30 segundos
            server_time=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando datos: {str(e)}")

@app.post("/api/microcontroller/batch", response_model=MicrocontrollerResponse)
async def receive_batch_data(batch: MicrocontrollerBatch):
    """
    Endpoint para recibir datos en lote (más eficiente para conexiones intermitentes)
    Ejemplo de uso cuando el microcontrolador almacena datos offline
    """
    try:
        montacarga_exists = any(m["id"] == batch.mc_id for m in montacargas_db)
        if not montacarga_exists:
            raise HTTPException(status_code=404, detail=f"Montacarga {batch.mc_id} no encontrado")
        
        puntos_procesados = 0
        
        for punto_data in batch.data:
            # Procesar cada punto del lote
            punto = MicrocontrollerData(
                mc_id=batch.mc_id,
                timestamp=punto_data.get("t"),
                lat=punto_data.get("lat"),
                lng=punto_data.get("lng"),
                speed=punto_data.get("s", 0),
                battery=punto_data.get("b", 100),
                status=punto_data.get("st", "active")
            )
            
            # Usar la misma lógica del endpoint individual
            await receive_microcontroller_data(punto)
            puntos_procesados += 1
        
        return MicrocontrollerResponse(
            success=True,
            message=f"Lote procesado: {puntos_procesados} puntos",
            next_upload_in=120,  # Próximo lote en 2 minutos
            server_time=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando lote: {str(e)}")

@app.get("/api/microcontroller/config/{mc_id}")
async def get_microcontroller_config(mc_id: int):
    """
    Endpoint para que el microcontrolador obtenga su configuración
    """
    montacarga = next((m for m in montacargas_db if m["id"] == mc_id), None)
    if not montacarga:
        raise HTTPException(status_code=404, detail="Montacarga no encontrado")
    
    return {
        "mc_id": mc_id,
        "upload_interval": 30,  # segundos entre envíos
        "batch_size": 10,       # puntos por lote
        "compression": True,    # usar compresión
        "server_time": datetime.now().isoformat(),
        "montacarga_info": montacarga
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
