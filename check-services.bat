@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
cd /d "%ROOT%"

echo.
echo ===================================================
echo   SathiX-OS — Service Health Check
echo ===================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\native\orchestrator.ps1" -Action check
exit /b 0
