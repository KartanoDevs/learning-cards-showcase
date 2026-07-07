@echo off
title Learning Cards - Instalacion y Arranque
color 0B
CLS
echo.
echo ====================================================
echo   LEARNING CARDS - INSTALADOR Y ARRANQUE
echo ====================================================
echo.
echo   [!] PRIMERO - COPIA DE SEGURIDAD AUTOMATICA
echo       A continuacion se ejecutara el backup.
call make_backup.bat
color 0A
CLS
echo.
echo ====================================================
echo   CONTINUANDO CON EL DESPLIEGUE...
echo ====================================================
echo.
echo Este proceso tardara unos minutos la primera vez.
echo Por favor, espera sin cerrar esta ventana...
echo.
echo ----------------------------------------------------
echo   Paso 1/3: Cargando imagen del Backend...
echo ----------------------------------------------------
docker load -i backend.tar
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ERROR: No se pudo cargar la imagen del backend.
    echo Verifica que Docker Desktop este corriendo.
    echo.
    pause
    exit /b 1
)
echo OK - Backend cargado correctamente.
echo.
echo ----------------------------------------------------
echo   Paso 2/3: Cargando imagen del Frontend...
echo ----------------------------------------------------
docker load -i frontend.tar
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ERROR: No se pudo cargar la imagen del frontend.
    echo Verifica que Docker Desktop este corriendo.
    echo.
    pause
    exit /b 1
)
echo OK - Frontend cargado correctamente.
echo.
echo ----------------------------------------------------
echo   Paso 3/3: Iniciando contenedores...
echo ----------------------------------------------------
docker-compose up -d --force-recreate
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ERROR FATAL: No se pudieron iniciar los contenedores.
    echo Revisa que los puertos 80 y 4000 esten libres.
    echo.
    pause
    exit /b 1
)
echo OK - Contenedores iniciados correctamente.
echo.
echo ----------------------------------------------------
echo   Esperando que los servicios esten listos...
echo ----------------------------------------------------
echo Espera 20 segundos mientras arranca todo...
timeout /t 20 /nobreak > nul
echo.
color 0A
echo ====================================================
echo   INSTALACION COMPLETADA CON EXITO
echo ====================================================
echo.
echo   La aplicacion esta corriendo en:
echo   http://localhost
echo.
echo   Presiona cualquier tecla para abrir el navegador...
echo ====================================================
pause > nul
echo.
echo Abriendo navegador...
start http://localhost
echo.
echo El navegador se ha abierto. Si no ves la aplicacion,
echo visita manualmente: http://localhost
echo.
echo Para DETENER la aplicacion, ejecuta STOP_APP.bat
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
