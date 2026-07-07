# ================================================================
# BUILD RELEASE SCRIPT - Learning Cards Application (V3 - Corregida)
# ================================================================

param(
    [string]$Version = "1.0.0"
)

# --- Configuración ---
$ErrorActionPreference = "Stop"
$ReleaseDir = "release"
$BackendImage = "learning-cards-backend"
$FrontendImage = "learning-cards-frontend"
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"

# --- Funciones Auxiliares ---
function Write-Step { param([string]$Message); Write-Host "`n>>> $Message" -ForegroundColor Cyan }
function Write-Success { param([string]$Message); Write-Host "OK: $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message); Write-Host "ADVERTENCIA: $Message" -ForegroundColor Yellow }
function Write-ErrorMsg { param([string]$Message); Write-Host "ERROR: $Message" -ForegroundColor Red }

function Get-FileSize {
    param([string]$Path)
    if (Test-Path $Path) {
        $size = (Get-Item $Path).Length / 1MB
        return "{0:N2} MB" -f $size
    }
    return "0 MB"
}

# --- Script Principal ---
Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "  LEARNING CARDS - BUILD RELEASE" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

try {
    # 0. Verificar si Docker está corriendo
    Write-Step "Verificando motor de Docker..."
    & docker info >$null 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no esta iniciado. Por favor, abre Docker Desktop."
    }
    Write-Success "Docker detectado"

    # 1. Limpiar release anterior
    Write-Step "Preparando carpeta de release..."
    if (Test-Path $ReleaseDir) {
        Remove-Item -Recurse -Force $ReleaseDir
    }
    New-Item -ItemType Directory -Force -Path $ReleaseDir | Out-Null
    Write-Success "Carpeta preparada"

    # 2. Habilitar Docker BuildKit
    $env:DOCKER_BUILDKIT = 1

    # 3. Construir Backend
    Write-Step "Construyendo imagen del Backend..."
    & docker build --pull -t "${BackendImage}:$Version" -t "${BackendImage}:latest" --build-arg NODE_ENV=production ./back
    Write-Success "Backend construido"

    # 4. Construir Frontend
    Write-Step "Construyendo imagen del Frontend..."
    & docker build --pull -t "${FrontendImage}:$Version" -t "${FrontendImage}:latest" ./front
    Write-Success "Frontend construido"

    # 5. Exportar imágenes (Docker Save)
    Write-Step "Exportando imagenes a .tar (esto tarda)..."
    & docker save -o "$ReleaseDir/backend.tar" "${BackendImage}:latest"
    & docker save -o "$ReleaseDir/frontend.tar" "${FrontendImage}:latest"
    
    $backendSize = Get-FileSize "$ReleaseDir/backend.tar"
    $frontendSize = Get-FileSize "$ReleaseDir/frontend.tar"
    Write-Success "Imagenes exportadas"

    # 6. Copiar archivos necesarios
    Write-Step "Copiando configuracion..."
    if (Test-Path "docker-compose.prod.yml") {
        Copy-Item "docker-compose.prod.yml" -Destination "$ReleaseDir\docker-compose.yml"
    } elseif (Test-Path "docker-compose.yml") {
        Copy-Item "docker-compose.yml" -Destination "$ReleaseDir\docker-compose.yml"
    }

    # 7. Gestionar .env
    $envPath = "$ReleaseDir\.env"
    if (Test-Path ".env") {
        Copy-Item ".env" -Destination $envPath
    } else {
        $envLines = @(
            "MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/database",
            "PORT=4000",
            "NODE_ENV=production"
        )
        $envLines | Out-File -FilePath $envPath -Encoding UTF8
    }


    # 8. Copiar Script de Backup
    if (Test-Path "make_backup.bat") {
        Write-Step "Incluyendo script de backup..."
        Copy-Item "make_backup.bat" -Destination "$ReleaseDir\make_backup.bat"
    }

    # 9. Crear Scripts de Windows mejorados
    Write-Step "Generando lanzadores..."
    $startBat = @(
        "@echo off",
        "title Learning Cards - Instalacion y Arranque",
        "color 0B",
        "CLS",
        "echo.",
        "echo ====================================================",
        "echo   LEARNING CARDS - INSTALADOR Y ARRANQUE",
        "echo ====================================================",
        "echo.",
        "echo   [!] PRIMERO - COPIA DE SEGURIDAD AUTOMATICA",
        "echo       A continuacion se ejecutara el backup.",
        "call make_backup.bat",
        "color 0A",
        "CLS",
        "echo.",
        "echo ====================================================",
        "echo   CONTINUANDO CON EL DESPLIEGUE...",
        "echo ====================================================",
        "echo.",
        "echo Este proceso tardara unos minutos la primera vez.",
        "echo Por favor, espera sin cerrar esta ventana...",
        "echo.",
        "echo ----------------------------------------------------",
        "echo   Paso 1/3: Cargando imagen del Backend...",
        "echo ----------------------------------------------------",
        "docker load -i backend.tar",
        "if %ERRORLEVEL% NEQ 0 (",
        "    color 0C",
        "    echo.",
        "    echo ERROR: No se pudo cargar la imagen del backend.",
        "    echo Verifica que Docker Desktop este corriendo.",
        "    echo.",
        "    pause",
        "    exit /b 1",
        ")",
        "echo OK - Backend cargado correctamente.",
        "echo.",
        "echo ----------------------------------------------------",
        "echo   Paso 2/3: Cargando imagen del Frontend...",
        "echo ----------------------------------------------------",
        "docker load -i frontend.tar",
        "if %ERRORLEVEL% NEQ 0 (",
        "    color 0C",
        "    echo.",
        "    echo ERROR: No se pudo cargar la imagen del frontend.",
        "    echo Verifica que Docker Desktop este corriendo.",
        "    echo.",
        "    pause",
        "    exit /b 1",
        ")",
        "echo OK - Frontend cargado correctamente.",
        "echo.",
        "echo ----------------------------------------------------",
        "echo   Paso 3/3: Iniciando contenedores...",
        "echo ----------------------------------------------------",
        "docker-compose up -d --force-recreate",
        "if %ERRORLEVEL% NEQ 0 (",
        "    color 0C",
        "    echo.",
        "    echo ERROR FATAL: No se pudieron iniciar los contenedores.",
        "    echo Revisa que los puertos 80 y 4000 esten libres.",
        "    echo.",
        "    pause",
        "    exit /b 1",
        ")",
        "echo OK - Contenedores iniciados correctamente.",
        "echo.",
        "echo ----------------------------------------------------",
        "echo   Esperando que los servicios esten listos...",
        "echo ----------------------------------------------------",
        "echo Espera 20 segundos mientras arranca todo...",
        "timeout /t 20 /nobreak > nul",
        "echo.",
        "color 0A",
        "echo ====================================================",
        "echo   INSTALACION COMPLETADA CON EXITO",
        "echo ====================================================",
        "echo.",
        "echo   La aplicacion esta corriendo en:",
        "echo   http://localhost",
        "echo.",
        "echo   Presiona cualquier tecla para abrir el navegador...",
        "echo ====================================================",
        "pause > nul",
        "echo.",
        "echo Abriendo navegador...",
        "start http://localhost",
        "echo.",
        "echo El navegador se ha abierto. Si no ves la aplicacion,",
        "echo visita manualmente: http://localhost",
        "echo.",
        "echo Para DETENER la aplicacion, ejecuta STOP_APP.bat",
        "echo.",
        "echo Presiona cualquier tecla para cerrar esta ventana...",
        "pause > nul"
    )
    $startBat | Out-File -FilePath "$ReleaseDir\START_APP.bat" -Encoding ASCII


    $stopBat = @(
        "@echo off",
        "docker-compose down",
        "echo Hecho.",
        "pause"
    )
    $stopBat | Out-File -FilePath "$ReleaseDir\STOP_APP.bat" -Encoding ASCII

    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  PROCESO COMPLETADO" -ForegroundColor Green
    Write-Host "========================================`n"

} catch {
    Write-Host "`nFALLO EN EL BUILD:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}