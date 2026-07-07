# 🎴 Learning Cards Showcase

> Aplicación de tarjetas de aprendizaje (flashcards) con grupos personalizables, desarrollada con Angular 19 y Node.js + Express + MongoDB.
>
> Esta es la copia pública de portfolio del proyecto (sin datos ni credenciales reales).

---

## 📖 Descripción

**Learning Cards Showcase** es una aplicación web completa para crear, gestionar y estudiar tarjetas de aprendizaje (flashcards) organizadas por grupos temáticos. Ideal para estudiantes, profesores o cualquier persona que quiera memorizar información de manera efectiva.

### ✨ Características Principales

- 📚 **Gestión de Grupos**: Crea grupos temáticos para organizar tus tarjetas
- 🎴 **Tarjetas Personalizables**: Cada tarjeta tiene front (pregunta) y back (respuesta)
- ⭐ **Favoritos**: Marca grupos como favoritos para acceso rápido
- 🔀 **Shuffle**: Modo aleatorio para repasar tarjetas
- 👁️ **Visibilidad**: Controla qué grupos son visibles
- 🎨 **Interfaz Moderna**: Diseño limpio y responsivo con Angular Material
- 🐳 **Dockerizado**: Fácil despliegue con Docker Desktop

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- ⚡ Angular 19 (Standalone Components)
- 🎨 Angular Material
- 📱 Diseño Responsivo
- 🔄 RxJS para manejo reactivo de datos

**Backend:**
- 🟢 Node.js + Express 5
- 📘 TypeScript
- 🔒 Helmet (Seguridad)
- 🗜️ Compression
- 📊 Morgan (Logging)

**Base de Datos:**
- 🍃 MongoDB Atlas (Cloud)
- 📦 Mongoose ODM

**DevOps:**
- 🐳 Docker + Docker Compose
- 🔧 Multi-stage builds optimizados
- ✅ Health checks integrados

---

## 📦 Estructura del Proyecto

```
learning-cards-showcase/
├── back/                      # Backend (API Node.js)
│   ├── src/
│   │   ├── controllers/       # Controladores (groups, cards)
│   │   ├── models/            # Modelos Mongoose
│   │   ├── routes/            # Rutas Express
│   │   ├── middlewares/       # Middlewares personalizados
│   │   ├── config/            # Configuración (DB, ENV)
│   │   ├── app.ts             # Configuración Express
│   │   └── index.ts           # Entry point
│   ├── Dockerfile             # Imagen Docker del backend
│   ├── package.json
│   └── tsconfig.json
│
├── front/                     # Frontend (Angular 19)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Componentes reutilizables
│   │   │   ├── pages/         # Páginas principales
│   │   │   ├── services/      # Servicios (API calls)
│   │   │   └── interfaces/    # Interfaces TypeScript
│   │   ├── environments/      # Configuración de entornos
│   │   └── styles.css         # Estilos globales
│   ├── Dockerfile             # Imagen Docker del frontend
│   ├── nginx.conf             # Configuración Nginx
│   ├── package.json
│   └── angular.json
│
├── release/                   # Carpeta generada automáticamente
│   ├── START_APP.bat          # Script para iniciar la app
│   ├── STOP_APP.bat           # Script para detener la app
│   ├── backend.tar            # Imagen Docker del backend
│   ├── frontend.tar           # Imagen Docker del frontend
│   ├── docker-compose.yml     # Configuración de contenedores
│   └── .env                   # Variables de entorno
│
├── .env                       # Variables de entorno (desarrollo/producción)
├── docker-compose.prod.yml    # Configuración Docker producción
├── build_release.ps1          # Script de construcción
├── check_docker.ps1           # Verificar Docker
├── README.md                  # Este archivo
├── README_DESPLIEGUE.md       # Guía detallada de despliegue
└── README_VISUAL.md           # Guía rápida visual
```

---

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

**Ideal para producción o demostración rápida.**

```powershell
# 1. Verifica que Docker Desktop esté corriendo
.\check_docker.ps1

# 2. Construye las imágenes (solo la primera vez)
.\build_release.ps1 -Version "1.0.0"

# 3. Inicia la aplicación
cd release
.\START_APP.bat

# 4. Accede a la aplicación
# Frontend: http://localhost
# Backend:  http://localhost:4000
```

### Opción 2: Desarrollo Local

**Para desarrollo activo con hot-reload.**

**Backend:**
```powershell
cd back
npm install
npm run dev
# Corre en http://localhost:4000
```

**Frontend:**
```powershell
cd front
npm install
npm start
# Corre en http://localhost:4200
```

---

## 📚 Documentación Adicional

- 📖 **[Guía de Despliegue Completa](README_DESPLIEGUE.md)** - Instrucciones detalladas paso a paso
- 🎨 **[Guía Visual](README_VISUAL.md)** - Versión condensada para generar imágenes

---

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` en la raíz y rellena con tus propios valores:

```env
# MongoDB
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database

# Backend
PORT=4000
NODE_ENV=production

# CORS
CORS_ORIGIN=*
```

---

## 🎮 Uso de la Aplicación

### 1. Gestión de Grupos

- **Crear Grupo**: Haz clic en "Nuevo Grupo"
- **Editar Grupo**: Click en el icono de edición
- **Eliminar Grupo**: Click en el icono de basura
- **Marcar Favorito**: Click en la estrella
- **Cambiar Visibilidad**: Toggle de visibilidad

### 2. Gestión de Tarjetas

- **Crear Tarjeta**: Selecciona un grupo y haz clic en "Nueva Tarjeta"
- **Editar Tarjeta**: Click en el icono de edición
- **Eliminar Tarjeta**: Click en el icono de basura
- **Ordenar Tarjetas**: Drag & Drop para reordenar

### 3. Estudiar

- **Modo Normal**: Navega con flechas o clicks
- **Modo Shuffle**: Activa el shuffle para orden aleatorio
- **Voltear Tarjeta**: Click en la tarjeta para ver la respuesta

---

## 🛠️ Comandos Útiles

### Docker

```powershell
# Ver contenedores corriendo
docker ps

# Ver logs del backend
docker logs learning-cards-api

# Ver logs del frontend
docker logs learning-cards-web

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Limpiar imágenes
docker system prune -a
```

### Desarrollo

```powershell
# Backend - Compilar TypeScript
cd back
npm run build

# Backend - Modo desarrollo
npm run dev

# Frontend - Compilar para producción
cd front
npm run build

# Frontend - Servidor de desarrollo
npm start
```

---

## 🧪 Testing

### Backend
```powershell
cd back
npm test
```

### Frontend
```powershell
cd front
npm test
```

---

## 🐛 Solución de Problemas

### Backend no conecta a MongoDB

✅ **Verifica:**
- MONGO_URI está correctamente configurado en `.env`
- Tienes conexión a Internet
- Las credenciales de MongoDB Atlas son válidas
- El firewall permite conexiones a MongoDB

### Puerto 80 o 4000 en uso

✅ **Solución:**
- Detén otros servicios que usen esos puertos
- O cambia los puertos en `docker-compose.yml`

### Frontend no carga

✅ **Verifica:**
- El backend está corriendo (`http://localhost:4000/health`)
- La configuración de `environment.prod.ts` apunta a la URL correcta
- No hay errores en la consola del navegador

---

## 📊 API Endpoints

### Grupos

```
GET    /api/groups        # Listar todos los grupos
GET    /api/groups/:id    # Obtener un grupo por ID
POST   /api/groups        # Crear nuevo grupo
PUT    /api/groups/:id    # Actualizar grupo
DELETE /api/groups/:id    # Eliminar grupo
```

### Tarjetas

```
GET    /api/cards                # Listar todas las tarjetas
GET    /api/cards/:id            # Obtener tarjeta por ID
GET    /api/cards/group/:groupId # Tarjetas de un grupo
POST   /api/cards                # Crear nueva tarjeta
PUT    /api/cards/:id            # Actualizar tarjeta
DELETE /api/cards/:id            # Eliminar tarjeta
```

### Health Check

```
GET    /health            # Verificar estado del servidor
```

---

## 🔒 Seguridad

- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **CORS**: Control de acceso cross-origin
- ✅ **Docker**: Contenedores con usuarios no privilegiados
- ✅ **Variables de Entorno**: Credenciales fuera del código
- ✅ **HTTPS**: Recomendado para producción (usa nginx reverse proxy)

---

## 📈 Mejoras Futuras

- [ ] Sistema de autenticación (login/registro)
- [ ] Perfiles de usuario
- [ ] Compartir grupos públicamente
- [ ] Estadísticas de estudio
- [ ] Modo offline con Service Workers
- [ ] Aplicación móvil (Ionic/Capacitor)
- [ ] Exportar/Importar grupos (JSON/CSV)
- [ ] Soporte para imágenes en tarjetas
- [ ] Gamificación (puntos, logros)

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Principios de Desarrollo

Este proyecto sigue:

- ✅ **SOLID**: Principios de diseño orientado a objetos
- ✅ **Clean Code**: Código limpio y legible
- ✅ **DRY**: Don't Repeat Yourself
- ✅ **Inyección de Dependencias**: Usando el DI de Angular
- ✅ **Programación Reactiva**: RxJS y Observables
- ✅ **Tipado Fuerte**: TypeScript en frontend y backend

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa el [README_DESPLIEGUE.md](README_DESPLIEGUE.md)
2. Consulta la sección de [Solución de Problemas](#-solución-de-problemas)
3. Revisa los logs de Docker: `docker logs learning-cards-api`

---

## ✨ Agradecimientos

Desarrollado con ❤️ usando tecnologías modernas y mejores prácticas de la industria.

---

**¡Happy Learning! 🎓**
