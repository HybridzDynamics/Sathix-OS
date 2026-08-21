@echo off
echo ===================================================
echo Starting SathiX-OS Local Docker Environment
echo ===================================================
echo.
echo Make sure you have Docker Desktop running!
echo.

IF NOT EXIST ".env" (
    echo [INFO] .env file not found. Creating from .env.example...
    copy .env.example .env
    echo [SUCCESS] Created .env file. Please update secrets if necessary.
) ELSE (
    echo [INFO] .env file found.
)

echo.
echo Bringing up containers...
docker-compose up --build -d

echo.
echo ===================================================
echo SathiX-OS is starting in the background!
echo ===================================================
echo You can view the logs using: docker-compose logs -f
echo To stop the environment, run: docker-compose down
echo.
pause
