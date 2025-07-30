@echo off
echo ========================================
echo Personal Finance Tracker - Latest Build
echo ========================================

:: Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

:: Set log file with timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"
set "logfile=logs\build_%datestamp%.log"

echo Build started at %date% %time% > %logfile%
echo Build started at %date% %time%

echo.
echo [1/6] Cleaning previous builds...
echo [1/6] Cleaning previous builds... >> %logfile%

:: Clean backend dist
if exist "backend\dist" (
    echo Removing backend\dist... >> %logfile%
    rmdir /s /q "backend\dist" 2>> %logfile%
)

:: Clean frontend .next
if exist "frontend\.next" (
    echo Removing frontend\.next... >> %logfile%
    rmdir /s /q "frontend\.next" 2>> %logfile%
)

echo.
echo [2/6] Installing backend dependencies...
echo [2/6] Installing backend dependencies... >> %logfile%
cd backend
call npm install >> ..\%logfile% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Backend dependency installation failed! >> ..\%logfile%
    echo ERROR: Backend dependency installation failed!
    cd ..
    goto :error
)

echo.
echo [3/6] Building backend...
echo [3/6] Building backend... >> ..\%logfile%
call npm run build >> ..\%logfile% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed! >> ..\%logfile%
    echo ERROR: Backend build failed!
    cd ..
    goto :error
)
cd ..

echo.
echo [4/6] Installing frontend dependencies...
echo [4/6] Installing frontend dependencies... >> %logfile%
cd frontend
call npm install >> ..\%logfile% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependency installation failed! >> ..\%logfile%
    echo ERROR: Frontend dependency installation failed!
    cd ..
    goto :error
)

echo.
echo [5/6] Building frontend...
echo [5/6] Building frontend... >> %logfile%
call npm run build >> ..\%logfile% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed! >> ..\%logfile%
    echo ERROR: Frontend build failed!
    cd ..
    goto :error
)
cd ..

echo.
echo [6/6] Starting application with Docker...
echo [6/6] Starting application with Docker... >> %logfile%

:: Stop existing containers
echo Stopping existing containers... >> %logfile%
docker-compose down >> %logfile% 2>&1

:: Start containers
echo Starting containers... >> %logfile%
docker-compose up -d >> %logfile% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker containers failed to start! >> %logfile%
    echo ERROR: Docker containers failed to start!
    goto :error
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo Build completed at %date% %time% >> %logfile%
echo Build completed at %date% %time%
echo.
echo Application URLs:
echo - Main App (Nginx):     http://localhost:8080
echo - Backend API:          http://localhost:5050
echo - Grafana Dashboard:    http://localhost:3003 (admin/admin)
echo - Prometheus:           http://localhost:9090
echo.
echo Log file saved to: %logfile%
echo.
echo To view live logs, run: docker-compose logs -f
echo To view specific service logs: docker-compose logs -f [service-name]
echo Available services: frontend, backend, mongo, prometheus, grafana, nginx, loki, promtail
echo.
goto :end

:error
echo.
echo ========================================
echo BUILD FAILED!
echo ========================================
echo Build failed at %date% %time% >> %logfile%
echo Build failed at %date% %time%
echo Check the log file for details: %logfile%
echo.
exit /b 1

:end
pause