from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
import os

# Crear la instancia de FastAPI
app = FastAPI(
    title="Reto Renault API",
    description="API backend para la aplicación Reto Renault",
    version="1.0.0"
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
