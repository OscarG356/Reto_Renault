cd frontend
npm run dev# 📍 COORDENADAS DE LA UNIVERSIDAD DE ANTIOQUIA - MEDELLÍN

## 🎓 Ubicaciones Configuradas para Pruebas

### **Campus Ciudad Universitaria**
- **Ubicación**: Calle 70 No. 52-21, Medellín, Antioquia
- **Coordenadas Centro**: 6.2670° N, -75.5686° W
- **Área**: Aproximadamente 2.5 km²

---

## 🚚 MONTACARGAS Y RECORRIDOS

### **MC-001 (Toyota 8FBN25) - Facultad de Ingeniería**
**Recorrido**: Área de Ingeniería y Investigación

| Punto | Ubicación | Latitud | Longitud | Descripción |
|-------|-----------|---------|----------|-------------|
| 1 | Entrada Principal | 6.26701 | -75.56859 | Acceso principal a Ciudad Universitaria |
| 2 | Biblioteca Central | 6.26723 | -75.56901 | Centro de información académica |
| 3 | Bloque 21 - Ingeniería | 6.26756 | -75.56825 | Facultad de Ingeniería principal |
| 4 | Laboratorios Ingeniería | 6.26789 | -75.56756 | Laboratorios especializados |
| 5 | Bloque 19 - Investigación | 6.26812 | -75.56698 | Centro de investigación |

**Características del recorrido:**
- ⏱️ Duración: 45 minutos
- 📏 Distancia: 1.2 km
- ⚡ Velocidad promedio: 12 km/h
- 🔋 Consumo de batería: 6%

---

### **MC-002 (Caterpillar DP25N) - Área Cultural**
**Recorrido**: Espacios culturales y recreativos

| Punto | Ubicación | Latitud | Longitud | Descripción |
|-------|-----------|---------|----------|-------------|
| 1 | Parqueadero Principal | 6.26623 | -75.56978 | Zona de parqueo principal |
| 2 | Auditorio Principal | 6.26656 | -75.57012 | Espacio para eventos académicos |
| 3 | Teatro Universitario | 6.26689 | -75.57045 | Teatro Carlos Vieco Ortiz |
| 4 | Museo Universitario | 6.26712 | -75.57089 | Museo de Antropología |
| 5 | Jardín Botánico | 6.26734 | -75.57123 | Jardín Botánico Joaquín Antonio Uribe |
| 6 | Planetario | 6.26756 | -75.57156 | Planetario Municipal Jesús Emilio Ramírez |
| 7 | Extensión Cultural | 6.26778 | -75.57189 | Programas de extensión |

**Características del recorrido:**
- ⏱️ Duración: 90 minutos
- 📏 Distancia: 1.8 km
- ⚡ Velocidad promedio: 14 km/h
- 🔋 Consumo de batería: 9%

---

### **MC-003 (Hyundai 25D-7E) - Ciencias Exactas**
**Recorrido**: Área científica y tecnológica

| Punto | Ubicación | Latitud | Longitud | Descripción |
|-------|-----------|---------|----------|-------------|
| 1 | Facultad de Ciencias Exactas | 6.26578 | -75.56734 | Matemáticas, Física, Biología |
| 2 | Laboratorios de Física | 6.26601 | -75.56689 | Laboratorios especializados |
| 3 | Instituto de Matemáticas | 6.26634 | -75.56612 | Centro de investigación matemática |
| 4 | Centro de Cómputo | 6.26667 | -75.56567 | Servicios informáticos |
| 5 | Laboratorios de Química | 6.26689 | -75.56523 | Química analítica y orgánica |
| 6 | Bioterio Universidad | 6.26712 | -75.56478 | Investigación biomédica |
| 7 | Laboratorios Biotecnología | 6.26734 | -75.56434 | Biotecnología aplicada |

**Características del recorrido:**
- ⏱️ Duración: 90 minutos
- 📏 Distancia: 1.5 km
- ⚡ Velocidad promedio: 15 km/h
- 🔋 Consumo de batería: 10%

---

## 📊 ESTADÍSTICAS GENERALES

### **Cobertura del Campus**
- 🏢 **Facultades cubiertas**: Ingeniería, Ciencias Exactas, Medicina
- 🎭 **Áreas culturales**: Teatro, Museo, Jardín Botánico, Planetario
- 🔬 **Centros de investigación**: 5 laboratorios especializados
- 📚 **Servicios académicos**: Biblioteca, Centro de Cómputo

### **Métricas Operacionales**
- 📍 **Total puntos GPS**: 19 ubicaciones únicas
- 🛣️ **Distancia total cubierta**: 4.5 km
- ⏰ **Tiempo total operación**: 205 minutos (3.4 horas)
- 🔋 **Consumo promedio batería**: 8.3%

---

## 🌐 COORDENADAS PARA DESARROLLO

### **Endpoints API Disponibles**

```bash
# Enviar coordenadas individuales
POST http://localhost:8000/api/microcontroller/data
Content-Type: application/json

{
  "mc_id": 1,
  "timestamp": "2025-10-18T14:30:45",
  "lat": 6.26701,
  "lng": -75.56859,
  "speed": 12.0,
  "battery": 95,
  "status": "active"
}
```

```bash
# Ver todos los recorridos
GET http://localhost:8000/api/recorridos
```

```bash
# Ver métricas del dashboard
GET http://localhost:8000/api/dashboard/stats
```

---

## 🚀 CÓMO USAR

### **1. Iniciar el Sistema**
```powershell
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### **2. Cargar Coordenadas de Prueba**
```powershell
# Ejecutar script de coordenadas UdeA
.\test_coordinates.ps1
```

### **3. Ver Resultados**
- **🌐 Dashboard**: http://localhost:3000
- **📚 API Docs**: http://localhost:8000/docs
- **🗺️ Google Maps**: Se cargan automáticamente con los recorridos

---

## 📋 COORDENADAS DE REFERENCIA

### **Puntos Importantes UdeA**
```
Entrada Principal:     6.26701, -75.56859
Biblioteca Central:    6.26723, -75.56901  
Rectoría:             6.26745, -75.56823
Hospital Universitario: 6.26901, -75.56534
Teatro Universitario:  6.26689, -75.57045
Jardín Botánico:      6.26734, -75.57123
```

### **Límites del Campus**
```
Norte:  6.26956, -75.56356
Sur:    6.26578, -75.57189
Este:   6.26934, -75.56356  
Oeste:  6.26623, -75.57189
```

---

## 🎯 CASOS DE USO

### **Para Estudiantes de Ingeniería**
- Simulación de sistemas de localización GPS
- Análisis de rutas y optimización logística  
- Desarrollo de aplicaciones IoT
- Integración con Google Maps API

### **Para Investigación**
- Tracking de vehículos autónomos
- Análisis de patrones de movilidad
- Optimización de rutas en campus universitario
- Monitoreo de activos en tiempo real

### **Para Desarrollo de Software**
- API REST con FastAPI
- Frontend reactivo con React
- Mapas interactivos con Google Maps
- Dashboard en tiempo real con métricas

---

*📚 Universidad de Antioquia - Medellín, Colombia*  
*🚚 Sistema de Monitoreo de Montacargas - Reto Renault 2025*