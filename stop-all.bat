@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
cd /d "%ROOT%"

echo.
echo ===================================================
echo   SathiX-OS — Stop All Services
echo ===================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\native\orchestrator.ps1" -Action stop
exit /b %ERRORLEVEL%
