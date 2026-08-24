@echo off
setlocal EnableDelayedExpansion

REM SathiX-OS — start all services natively (no Docker)
REM Works from any directory; resolves project root automatically.

REM Resolve project root (this BAT lives in the repo root)
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

cd /d "%ROOT%"

echo.
echo ===================================================
echo   SathiX-OS — Native Local Startup
echo ===================================================
echo   Project root: %ROOT%
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not on PATH.
    echo         Install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

where powershell >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PowerShell is required.
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%\scripts\native\orchestrator.ps1" -Action start
set "EXIT_CODE=%ERRORLEVEL%"

if %EXIT_CODE% neq 0 (
    echo.
    echo [ERROR] Startup failed with exit code %EXIT_CODE%.
    exit /b %EXIT_CODE%
)

echo.
echo Startup complete. Use check-services.bat to verify.
exit /b 0
