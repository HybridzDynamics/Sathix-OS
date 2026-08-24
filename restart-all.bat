@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
cd /d "%ROOT%"

echo.
echo ===================================================
echo   SathiX-OS — Restart All Services
echo ===================================================
echo.

call "%ROOT%\stop-all.bat"
timeout /t 3 /nobreak >nul
call "%ROOT%\start-all.bat"
exit /b %ERRORLEVEL%
