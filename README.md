# 🚗 Reto Renault - Aplicación Full Stack

Una aplicación web full-stack desarrollada con **React** para el frontend, **FastAPI** para el backend, y configurada para despliegue en **Heroku**.

## 🚀 Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno y rápido para Python
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **Pydantic** - Validación de datos usando type hints de Python
- **Gunicorn** - Servidor WSGI para producción

### Frontend
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida para desarrollo frontend
- **Axios** - Cliente HTTP para realizar peticiones a la API
- **CSS3** - Estilos responsivos y modernos

### Despliegue
- **Heroku** - Plataforma de despliegue en la nube
- **Docker** - Contenedorización de aplicaciones
- **Docker Compose** - Orquestación de contenedores para desarrollo

## 📁 Estructura del Proyecto

```
Reto_Renault/
├── backend/                 # Aplicación FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py         # Punto de entrada de la API
│   ├── requirements.txt    # Dependencias de Python
│   ├── Procfile           # Configuración para Heroku
│   ├── runtime.txt        # Versión de Python para Heroku
│   └── Dockerfile         # Imagen Docker del backend
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   ├── App.css        # Estilos de la aplicación
│   │   ├── main.jsx       # Punto de entrada de React
│   │   └── index.css      # Estilos globales
│   ├── package.json       # Dependencias de Node.js
│   ├── vite.config.js     # Configuración de Vite
│   ├── Procfile          # Configuración para Heroku
│   ├── Dockerfile        # Imagen Docker del frontend
│   ├── .env              # Variables de entorno para desarrollo
│   └── .env.example      # Ejemplo de variables de entorno
├── docker-compose.yml     # Configuración de Docker Compose
└── README.md             # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Python 3.11+**
- **Node.js 18+**
- **npm** o **yarn**
- **Docker** (opcional)

### 🔧 Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear un entorno virtual:
```bash
python -m venv venv
```

3. Activar el entorno virtual:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Instalar dependencias:
```bash
pip install -r requirements.txt
```

5. Ejecutar el servidor de desarrollo:
```bash
uvicorn app.main:app --reload --port 8000
```

La API estará disponible en: `http://localhost:8000`
Documentación interactiva: `http://localhost:8000/docs`

### ⚛️ Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 🐳 Ejecución con Docker

Para ejecutar toda la aplicación usando Docker Compose:

```bash
docker-compose up --build
```

Esto iniciará:
- Backend en `http://localhost:8000`
- Frontend en `http://localhost:3000`

## 🚀 Despliegue en Heroku

### Backend (FastAPI)

1. Crear una nueva aplicación en Heroku:
```bash
heroku create tu-app-backend
```

2. Configurar el repositorio y hacer deploy:
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
heroku git:remote -a tu-app-backend
git push heroku main
```

### Frontend (React)

1. Crear una nueva aplicación en Heroku:
```bash
heroku create tu-app-frontend
```

2. Configurar variables de entorno:
```bash
heroku config:set VITE_API_URL=https://tu-app-backend.herokuapp.com -a tu-app-frontend
```

3. Hacer deploy:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
heroku git:remote -a tu-app-frontend
git push heroku main
```

## 📚 API Endpoints

### Endpoints Principales

- `GET /` - Mensaje de bienvenida
- `GET /health` - Verificación de estado de la API
- `GET /api/items` - Obtener todos los items
- `GET /api/items/{id}` - Obtener un item específico
- `POST /api/items` - Crear un nuevo item
- `DELETE /api/items/{id}` - Eliminar un item

### Ejemplo de Uso

```bash
# Obtener todos los items
curl http://localhost:8000/api/items

# Crear un nuevo item
curl -X POST http://localhost:8000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Producto Test", "description": "Descripción test", "price": 29.99}'
```

## 🎨 Características de la Aplicación

- ✅ **API REST completa** con FastAPI
- ✅ **Interfaz de usuario moderna** con React
- ✅ **Operaciones CRUD** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Validación de datos** con Pydantic
- ✅ **Diseño responsivo** y moderno
- ✅ **Configuración CORS** para desarrollo
- ✅ **Documentación automática** de la API
- ✅ **Contenedorización** con Docker
- ✅ **Lista para producción** en Heroku

## 🔧 Scripts Disponibles

### Backend
```bash
# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload

# Ejecutar con Gunicorn (producción)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend
```bash
# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o sugerencias, no dudes en contactar al equipo de desarrollo.

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!**
