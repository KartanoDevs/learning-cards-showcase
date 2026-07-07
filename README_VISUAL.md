# 🚀 LEARNING CARDS SHOWCASE - Guía Rápida Visual

---

## 🎯 PASO 1: REQUISITOS
```
✅ Docker Desktop instalado
✅ Windows 10/11
✅ Puertos 80 y 4000 libres
✅ 8 GB RAM mínimo
```

---

## 🔧 PASO 2: PREPARAR
```
1. Abre Docker Desktop
2. Espera a que inicie completamente
3. Ve a la carpeta del proyecto
```

---

## 🏗️ PASO 3: CONSTRUIR (SOLO LA PRIMERA VEZ)
```
Abre PowerShell en la carpeta del proyecto:

> .\build_release.ps1 -Version "1.0.0"

⏱️ Espera 5-15 minutos
📦 Se crea la carpeta "release/"
```

---

## ▶️ PASO 4: INICIAR LA APLICACIÓN
```
Opción A: Doble clic en:
📁 release/START_APP.bat

Opción B: PowerShell
> cd release
> .\START_APP.bat

⏱️ Espera 30-60 segundos
🌐 Se abre automáticamente el navegador
```

---

## 🌐 PASO 5: ACCEDER
```
Frontend: http://localhost
Backend:  http://localhost:4000/health
```

---

## ⏸️ PASO 6: DETENER
```
Doble clic en:
📁 release/STOP_APP.bat
```

---

## 📊 VERIFICAR ESTADO
```powershell
> docker ps

Debes ver 2 contenedores:
✅ learning-cards-web     (healthy)
✅ learning-cards-api     (healthy)
```

---

## ⚠️ PROBLEMAS COMUNES

### "Puerto 80 en uso"
```yaml
Edita: release/docker-compose.yml
Cambia: "80:80" → "8080:80"
Accede: http://localhost:8080
```

### "Docker no está corriendo"
```
1. Abre Docker Desktop
2. Espera al ícono sin animación
3. Intenta de nuevo
```

### Backend "unhealthy"
```
Verifica: release/.env
MONGO_URI debe estar correcto
Comprueba conexión a Internet
```

---

## 🔄 USO DIARIO

```
┌─────────────────────┐
│  CADA DÍA           │
├─────────────────────┤
│ 1. START_APP.bat    │ ← Doble clic
│ 2. Usar aplicación  │ ← http://localhost
│ 3. STOP_APP.bat     │ ← Doble clic
└─────────────────────┘
```

---

## 📦 ESTRUCTURA DE ARCHIVOS

```
learning-cards-showcase/
│
├── 🔧 build_release.ps1       ← Construir (1 sola vez)
├── ✅ check_docker.ps1         ← Verificar Docker
├── 📄 .env                     ← Configuración MongoDB
│
└── 📁 release/                 ← Se genera automáticamente
    ├── ▶️ START_APP.bat       ← INICIAR (úsalo cada día)
    ├── ⏸️ STOP_APP.bat        ← DETENER (úsalo cada día)
    ├── backend.tar
    ├── frontend.tar
    ├── docker-compose.yml
    └── .env
```

---

## 🎯 FLUJO COMPLETO

```
┌───────────────────────────────────────────────┐
│ PRIMERA VEZ                                   │
├───────────────────────────────────────────────┤
│ 1. Instalar Docker Desktop                    │
│ 2. Configurar .env (MONGO_URI)                │
│ 3. Ejecutar: build_release.ps1                │
│    ⏱️ Espera: 5-15 min                        │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│ USO DIARIO                                    │
├───────────────────────────────────────────────┤
│ 1. Doble clic: release/START_APP.bat          │
│    ⏱️ Espera: 30-60 seg                       │
│ 2. Navega a: http://localhost                 │
│ 3. Usa la aplicación                          │
│ 4. Doble clic: release/STOP_APP.bat           │
└───────────────────────────────────────────────┘
```

---

## 🏗️ ARQUITECTURA

```
Navegador (Puerto 80)
        ↓
    Frontend
  (Angular 19)
        ↓
    Backend                MongoDB Atlas
  (Node.js API) --------→   (Nube)
   (Puerto 4000)          cards.dfcroyh.mongodb.net
```

---

## ✅ CHECKLIST

```
PRE-DESPLIEGUE:
□ Docker Desktop instalado
□ Docker corriendo
□ .env configurado
□ Puertos libres

BUILD (1 VEZ):
□ build_release.ps1 ejecutado
□ Carpeta release/ creada
□ 2 archivos .tar generados

USO DIARIO:
□ START_APP.bat
□ http://localhost funciona
□ STOP_APP.bat al terminar
```

---

## 🆘 AYUDA RÁPIDA

### Ver contenedores:
```powershell
docker ps
```

### Ver logs Backend:
```powershell
docker logs learning-cards-api
```

### Ver logs Frontend:
```powershell
docker logs learning-cards-web
```

### Reiniciar todo:
```powershell
cd release
.\STOP_APP.bat
.\START_APP.bat
```

---

## 📞 COMANDOS ESENCIALES

```powershell
# Verificar Docker
docker --version

# Ver imágenes
docker images

# Ver contenedores
docker ps -a

# Limpiar todo
docker system prune -a
```

---

## 🎉 ¡LISTO!

```
✅ Aplicación corriendo
🌐 http://localhost
🔌 Backend: http://localhost:4000
📊 Health: http://localhost:4000/health
```

**¡Todo funcionando! 🚀**
