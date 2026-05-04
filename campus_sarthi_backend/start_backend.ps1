# Campus Sarthi — Start Backend
# Usage: .\start_backend.ps1

Write-Host "`n🚀 Starting Campus Sarthi Backend..." -ForegroundColor Yellow

$venvPython = Join-Path $PSScriptRoot "venv\Scripts\python.exe"

if (-not (Test-Path $venvPython)) {
    Write-Host "❌ venv not found. Run: python -m venv venv && .\venv\Scripts\pip install -r requirements.txt" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Using venv Python: $venvPython" -ForegroundColor Green
Write-Host "📡 Server starting at http://localhost:8000`n" -ForegroundColor Cyan

& $venvPython manage.py runserver 8000
