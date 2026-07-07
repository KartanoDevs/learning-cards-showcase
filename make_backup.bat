@echo off
setlocal

:: 1. Configuracion
for /f "usebackq tokens=*" %%a in (`powershell -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'"`) do set FECHA=%%a

:: Directorio de destino
set "DESTINO=backups\%FECHA%"
if not exist "backups" mkdir "backups"
if not exist "%DESTINO%" mkdir "%DESTINO%"

:: Ruta al ejecutable (Detectada anteriormente)
set "MONGOEXPORT_PATH=C:\Program Files\MongoDB\Tools\100\bin\mongoexport.exe"

:: URI de Conexión (leída del .env local, nunca hardcodeada)
for /f "usebackq tokens=1,* delims==" %%a in (".env") do if "%%a"=="MONGO_URI" set "URI=%%b"
if not defined URI (
    echo [ERROR] No se encontro MONGO_URI en el archivo .env
    pause
    exit /b 1
)

echo ========================================================
echo   COPIA DE SEGURIDAD (FORMATO JSON) - VONGOLA
echo ========================================================
echo.
echo [1/3] Preparando terreno...
echo       Destino: %DESTINO%
echo.

:: 2. Exportar Colección GROUPS
echo [2/3] Exportando 'groups' a JSON...
"%MONGOEXPORT_PATH%" --uri="%URI%" --collection=groups --out="%DESTINO%\groups.json" --jsonArray --pretty

:: 3. Exportar Colección CARDS
echo [3/3] Exportando 'cards' a JSON...
"%MONGOEXPORT_PATH%" --uri="%URI%" --collection=cards --out="%DESTINO%\cards.json" --jsonArray --pretty

echo.
if %ERRORLEVEL% EQU 0 (
    echo [EXITO] Los datos han sido extraidos en formato JSON.
    echo         Puedes importarlos en Compass facilmente.
    echo.
    echo         Carpeta: %CD%\%DESTINO%
    echo.
    pause
) else (
    echo [ERROR] Algo ha fallado. Revisa la conexion.
    pause
)

endlocal
