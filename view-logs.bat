@echo off
echo ========================================
echo Personal Finance Tracker - Log Viewer
echo ========================================
echo.
echo Choose log type to view:
echo.
echo [1] All services (live logs)
echo [2] Backend only
echo [3] Frontend only
echo [4] Database (MongoDB)
echo [5] Nginx (Reverse Proxy)
echo [6] Grafana (Monitoring)
echo [7] Prometheus (Metrics)
echo [8] Build logs (latest)
echo [9] Container status
echo [0] Exit
echo.
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto :all_logs
if "%choice%"=="2" goto :backend_logs
if "%choice%"=="3" goto :frontend_logs
if "%choice%"=="4" goto :mongo_logs
if "%choice%"=="5" goto :nginx_logs
if "%choice%"=="6" goto :grafana_logs
if "%choice%"=="7" goto :prometheus_logs
if "%choice%"=="8" goto :build_logs
if "%choice%"=="9" goto :container_status
if "%choice%"=="0" goto :end
goto :invalid

:all_logs
echo.
echo Showing live logs for all services (Press Ctrl+C to stop)...
echo.
docker-compose logs -f
goto :end

:backend_logs
echo.
echo Showing backend logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f backend
goto :end

:frontend_logs
echo.
echo Showing frontend logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f frontend
goto :end

:mongo_logs
echo.
echo Showing MongoDB logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f mongo
goto :end

:nginx_logs
echo.
echo Showing Nginx logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f nginx
goto :end

:grafana_logs
echo.
echo Showing Grafana logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f grafana
goto :end

:prometheus_logs
echo.
echo Showing Prometheus logs (Press Ctrl+C to stop)...
echo.
docker-compose logs -f prometheus
goto :end

:build_logs
echo.
echo Available build logs:
echo.
if exist "logs\" (
    dir /b /o-d logs\build_*.log 2>nul
    echo.
    set /p logfile="Enter log filename to view (or press Enter for latest): "
    if "!logfile!"=="" (
        for /f %%i in ('dir /b /o-d logs\build_*.log 2^>nul') do (
            set "logfile=%%i"
            goto :show_build_log
        )
    )
    :show_build_log
    if exist "logs\!logfile!" (
        echo.
        echo Showing build log: !logfile!
        echo ========================================
        type "logs\!logfile!"
    ) else (
        echo Log file not found: !logfile!
    )
) else (
    echo No build logs found. Run build-latest.bat first.
)
echo.
pause
goto :end

:container_status
echo.
echo Container Status:
echo ========================================
docker-compose ps
echo.
echo Container Resource Usage:
echo ========================================
docker stats --no-stream
echo.
pause
goto :end

:invalid
echo.
echo Invalid choice. Please try again.
echo.
pause
goto :start

:end