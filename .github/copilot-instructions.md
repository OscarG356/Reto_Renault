<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Proyecto Reto Renault - Instrucciones de Copilot

Este es un proyecto full-stack de **Dashboard de Montacargas** desarrollado con:

## Stack Tecnológico
- **Backend**: FastAPI (Python 3.11) con servidor en puerto 8000
- **Frontend**: React 18 + Vite en puerto 3000
- **Mapas**: Google Maps JavaScript API nativa
- **Despliegue**: Configurado para Heroku
- **Contenedorización**: Docker y Docker Compose

## Estado del Proyecto
- [x] ✅ Copilot instructions creado
- [x] ✅ Requisitos clarificados - React frontend, FastAPI backend, Heroku deployment
- [x] ✅ Proyecto scaffolded - Creado proyecto full-stack con React frontend, FastAPI backend y configuración Docker/Heroku
- [x] ✅ Proyecto personalizado - Dashboard de montacargas con API REST completa y frontend React interactivo
- [x] ✅ Extensiones instaladas - No se requieren extensiones específicas
- [x] ✅ Proyecto compilado - Entorno Python configurado y dependencias instaladas
- [x] ✅ Tareas creadas - Tareas de VS Code creadas para backend y frontend
- [x] ✅ Proyecto lanzado - Proyecto listo para ejecutar con tareas configuradas
- [x] ✅ Dashboard funcional - Interfaz completa con métricas dinámicas y filtros
- [x] ✅ Google Maps integrado - Visualización de rutas con mapas nativos de Google
- [x] ✅ API microcontroladores - Endpoints optimizados para recibir datos GPS
- [x] ✅ Documentación completa - README, tutorial y guías de API

## Funcionalidades Implementadas

### 📊 Dashboard Principal
- **Selector de montacargas**: Filtro dinámico que actualiza métricas y recorridos
- **Métricas en tiempo real**: Distancia total, tiempo, velocidad promedio, estado de flota
- **Lista de recorridos**: Detalles completos con coordenadas GPS y horarios
- **Interfaz responsive**: Diseño glassmorphism moderno

### 🗺️ Google Maps
- **Mapas nativos**: Implementación con Google Maps JavaScript API
- **Rutas coloreadas**: Cada montacarga tiene color diferenciado
- **Marcadores**: Inicio y fin de recorridos con info windows
- **Polylines**: Rutas completas con todas las coordenadas GPS
- **Zoom automático**: Se ajusta para mostrar todos los recorridos
- **Leyenda**: Identificación visual de montacargas por color

### 🤖 API para Microcontroladores
- **Endpoint individual**: `/api/microcontroller/data` para datos en tiempo real
- **Endpoint batch**: `/api/microcontroller/batch` para envío en lotes
- **Configuración**: `/api/microcontroller/config/{mc_id}` para parámetros
- **Validación robusta**: Coordenadas GPS, timestamps, velocidades
- **Respuestas optimizadas**: Tamaño compacto para microcontroladores

## Instrucciones para Copilot

### Estructura del Proyecto
- `backend/app/main.py` - Servidor FastAPI con endpoints completos
- `frontend/src/App.jsx` - Dashboard principal con estado reactivo
- `frontend/src/GoogleMap.jsx` - Componente de mapas nativo
- `frontend/src/Dashboard.css` - Estilos principales con glassmorphism
- `frontend/src/Mapa.css` - Estilos específicos para mapas
- `.vscode/tasks.json` - Tareas configuradas para desarrollo
- `docker-compose.yml` - Configuración para desarrollo con Docker

### Modelos de Datos

#### Montacargas
```javascript
{
  id: number,
  codigo: string,
  modelo: string,
  estado: "Activo" | "Mantenimiento"
}
```

#### Recorridos
```javascript
{
  id: number,
  montacarga_id: number,
  fecha: string,
  hora_inicio: string,
  hora_fin: string,
  distancia_km: number,
  tiempo_minutos: number,
  puntos_recorrido: [
    {
      lat: number,
      lng: number,
      timestamp: string
    }
  ]
}
```

#### Microcontrolador
```javascript
{
  mc_id: number,
  timestamp: string,
  lat: number,
  lng: number,
  speed?: number,
  battery?: number,
  status?: "active" | "idle" | "maintenance"
}
```

### Comandos de Desarrollo
- **Backend**: `uvicorn app.main:app --reload --port 8000`
- **Frontend**: `npm run dev` en directorio frontend
- **Ambos**: Usar tareas de VS Code "Start Backend Server" y "Start Frontend Server"
- **Docker**: `docker-compose up -d`

### API Endpoints Principales

#### Dashboard
- `GET /` - Mensaje de bienvenida
- `GET /health` - Estado de la API
- `GET /api/montacargas` - Lista de montacargas
- `GET /api/recorridos` - Lista de recorridos con coordenadas GPS
- `GET /api/dashboard/stats` - Métricas calculadas dinámicamente

#### Microcontroladores
- `POST /api/microcontroller/data` - Recibir datos GPS individuales
- `POST /api/microcontroller/batch` - Recibir datos en lote
- `GET /api/microcontroller/config/{mc_id}` - Configuración del dispositivo

### Características Técnicas
- **Métricas dinámicas**: Se recalculan automáticamente al seleccionar montacarga
- **Mapas responsivos**: Se adaptan al contenedor y datos disponibles
- **Validación GPS**: Coordenadas válidas (-90,90) latitud, (-180,180) longitud
- **Colores por montacarga**: Sistema de colores consistente en UI y mapas
- **Estado de carga**: Indicadores visuales mientras cargan datos
- **Manejo de errores**: Fallbacks para conexiones y APIs no disponibles

### Variables de Entorno
- **Frontend**: `VITE_API_URL` para URL del backend (default: http://localhost:8000)
- **Backend**: `PORT` para puerto del servidor (default: 8000)
- **Google Maps**: API Key configurada en `GoogleMap.jsx`

### Despliegue y Documentación
- **Heroku**: Configurado con Procfile en ambos directorios
- **Docker**: Disponible para desarrollo local
- **Documentación**: 
  - `README.md` - Información general del proyecto
  - `TUTORIAL_COMPLETO.md` - Guía paso a paso detallada
  - `MICROCONTROLLER_API.md` - Especificaciones para hardware
  - `INICIO_RAPIDO.md` - Guía de inicio rápido

### Patrones de Código
- **React hooks**: useState, useEffect para estado y efectos
- **Axios**: Para todas las llamadas HTTP
- **Responsive design**: CSS Grid y Flexbox
- **Error boundaries**: Manejo de errores en componentes
- **Async/await**: Para operaciones asíncronas
- **TypeScript ready**: Preparado para migración a TypeScript

### Testing y Desarrollo
- **Hot reload**: Tanto frontend como backend
- **CORS configurado**: Para desarrollo local
- **Logs detallados**: Console.log para debugging
- **API documentation**: Swagger UI automático en `/docs`
