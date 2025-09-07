<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Proyecto Reto Renault - Instrucciones de Copilot

Este es un proyecto full-stack desarrollado con:

## Stack Tecnológico
- **Backend**: FastAPI (Python) con servidor en puerto 8000
- **Frontend**: React con Vite en puerto 3000
- **Despliegue**: Configurado para Heroku
- **Contenedorización**: Docker y Docker Compose

## Estado del Proyecto
- [x] ✅ Copilot instructions creado
- [x] ✅ Requisitos clarificados - React frontend, FastAPI backend, Heroku deployment
- [x] ✅ Proyecto scaffolded - Creado proyecto full-stack con React frontend, FastAPI backend y configuración Docker/Heroku
- [x] ✅ Proyecto personalizado - Proyecto configurado con API REST completa y frontend React interactivo
- [x] ✅ Extensiones instaladas - No se requieren extensiones específicas
- [x] ✅ Proyecto compilado - Entorno Python configurado y dependencias instaladas
- [x] ✅ Tareas creadas - Tareas de VS Code creadas para backend y frontend
- [x] ✅ Proyecto lanzado - Proyecto listo para ejecutar con tareas configuradas
- [x] ✅ Documentación completa - README.md completo y copilot-instructions.md actualizado

## Instrucciones para Copilot

### Estructura del Proyecto
- `backend/` - Aplicación FastAPI con rutas REST
- `frontend/` - Aplicación React con Vite
- `.vscode/tasks.json` - Tareas configuradas para ejecutar servidores
- `docker-compose.yml` - Configuración para desarrollo con Docker
- `start.bat` / `start.sh` - Scripts para iniciar ambos servidores

### Comandos de Desarrollo
- Backend: Usar tarea "Start Backend Server" o `uvicorn app.main:app --reload`
- Frontend: Usar tarea "Start Frontend Server" o `npm run dev` en directorio frontend
- Ambos: Ejecutar `start.bat` (Windows) o `start.sh` (Unix)

### API Endpoints
- GET `/` - Mensaje de bienvenida
- GET `/health` - Estado de la API
- GET `/api/items` - Listar items
- POST `/api/items` - Crear item
- DELETE `/api/items/{id}` - Eliminar item

### Variables de Entorno
- Frontend: `VITE_API_URL` para URL del backend
- Backend: `PORT` para puerto del servidor

### Despliegue
- Configurado para Heroku con Procfile en ambos directorios
- Docker disponible para desarrollo local
- Variables de entorno configuradas para producción
