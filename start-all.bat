@echo off
cd /d "%~dp0"
if not exist "%~dp0start-all.ps1" (
  echo Nem talalom a start-all.ps1 fajlt a start-all.bat mellett.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-all.ps1"
