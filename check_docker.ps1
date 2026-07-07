# ================================================================
# CHECK DOCKER STATUS - Learning Cards
# ================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO DOCKER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    Write-Host "Comprobando si Docker está corriendo..." -ForegroundColor Yellow
    $dockerInfo = & docker info 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Docker está CORRIENDO correctamente`n" -ForegroundColor Green
        Write-Host "Versión de Docker:" -ForegroundColor Cyan
        & docker --version
        Write-Host "`nImágenes disponibles:" -ForegroundColor Cyan
        & docker images
        Write-Host "`nContenedores activos:" -ForegroundColor Cyan
        & docker ps -a
    } else {
        Write-Host "`n❌ Docker NO está corriendo`n" -ForegroundColor Red
        Write-Host "Por favor:" -ForegroundColor Yellow
        Write-Host "1. Abre Docker Desktop" -ForegroundColor White
        Write-Host "2. Espera a que inicie completamente" -ForegroundColor White
        Write-Host "3. Ejecuta este script de nuevo`n" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  TODO LISTO PARA CONSTRUIR" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
