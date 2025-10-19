#!/usr/bin/env python3
"""
🎓 Script de prueba para cargar coordenadas de la Universidad de Antioquia
"""

import requests
import json
import time
from datetime import datetime

# URL del servidor
API_URL = "http://localhost:8000"

def test_connection():
    """Verifica que el servidor esté funcionando"""
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"✅ Servidor funcionando: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Error conectando al servidor: {e}")
        return False

def send_gps_data(mc_id, lat, lng, ubicacion, speed=12.0, battery=90):
    """Envía coordenadas GPS al servidor"""
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    
    data = {
        "mc_id": mc_id,
        "timestamp": timestamp,
        "lat": lat,
        "lng": lng,
        "speed": speed,
        "battery": battery,
        "status": "active"
    }
    
    try:
        response = requests.post(f"{API_URL}/api/microcontroller/data", json=data)
        if response.status_code == 200:
            print(f"✅ [{ubicacion}] Coordenadas enviadas: lat={lat}, lng={lng}")
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error enviando coordenadas para {ubicacion}: {e}")
        return False

def main():
    print("🎓 CARGANDO COORDENADAS DE LA UNIVERSIDAD DE ANTIOQUIA - MEDELLÍN")
    print("=" * 70)
    
    # Verificar conexión
    if not test_connection():
        print("⚠️  Asegúrate de que el servidor esté corriendo en puerto 8000")
        return
    
    # Coordenadas de la UdeA
    coordenadas_udea = [
        # Montacarga MC-001 - Ingeniería
        (1, 6.26701, -75.56859, "Entrada Principal UdeA"),
        (1, 6.26723, -75.56901, "Biblioteca Central"),
        (1, 6.26756, -75.56825, "Bloque 21 - Ingeniería"),
        (1, 6.26789, -75.56756, "Laboratorios Ingeniería"),
        (1, 6.26812, -75.56698, "Bloque 19 - Investigación"),
        
        # Montacarga MC-002 - Área Cultural  
        (2, 6.26623, -75.56978, "Parqueadero Principal"),
        (2, 6.26656, -75.57012, "Auditorio Principal"),
        (2, 6.26689, -75.57045, "Teatro Universitario"),
        (2, 6.26712, -75.57089, "Museo Universitario"),
        
        # Montacarga MC-003 - Ciencias
        (3, 6.26578, -75.56734, "Facultad de Ciencias Exactas"),
        (3, 6.26601, -75.56689, "Laboratorios de Física"),
        (3, 6.26634, -75.56612, "Instituto de Matemáticas"),
        (3, 6.26667, -75.56567, "Centro de Cómputo"),
        (3, 6.26689, -75.56523, "Laboratorios de Química"),
        (3, 6.26712, -75.56478, "Bioterio Universidad"),
    ]
    
    print(f"\n🚚 Enviando {len(coordenadas_udea)} coordenadas de prueba...")
    
    exitosos = 0
    for mc_id, lat, lng, ubicacion in coordenadas_udea:
        if send_gps_data(mc_id, lat, lng, ubicacion):
            exitosos += 1
        time.sleep(1)  # Pausa entre envíos
    
    print(f"\n📊 Resultados: {exitosos}/{len(coordenadas_udea)} coordenadas enviadas exitosamente")
    
    # Verificar datos cargados
    try:
        response = requests.get(f"{API_URL}/api/recorridos")
        recorridos = response.json()
        print(f"📍 Total de recorridos en base de datos: {len(recorridos)}")
        
        response = requests.get(f"{API_URL}/api/dashboard/stats")
        stats = response.json()
        print(f"📈 Estadísticas del dashboard actualizadas")
        
    except Exception as e:
        print(f"⚠️  Error verificando datos: {e}")
    
    print("\n🎉 ¡COORDENADAS DE LA UdeA CARGADAS!")
    print("🌐 Abre http://localhost:8000/docs para ver la API")
    print("📊 Abre http://localhost:3000 para ver el dashboard (si tienes el frontend funcionando)")

if __name__ == "__main__":
    main()