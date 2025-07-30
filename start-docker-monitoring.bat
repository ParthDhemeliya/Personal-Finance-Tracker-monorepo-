@echo off
echo Starting Docker Container Monitoring Setup...
echo.

echo 1. Stopping existing containers...
docker-compose down

echo.
echo 2. Starting services with cAdvisor...
docker-compose up -d

echo.
echo 3. Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo 4. Checking service status...
docker-compose ps

echo.
echo 5. Testing cAdvisor metrics endpoint...
curl -s http://localhost:8081/metrics | findstr "container_" | head -5

echo.
echo 6. Testing Prometheus targets...
curl -s http://localhost:9090/api/v1/targets | findstr "cadvisor"

echo.
echo ========================================
echo Monitoring URLs:
echo ========================================
echo cAdvisor UI: http://localhost:8081
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3003 (admin/admin)
echo ========================================
echo.
echo Docker Container Monitoring Dashboard will be available in Grafana
echo Navigate to: http://localhost:3003
echo Login with: admin/admin
echo.
echo Press any key to continue...
pause > nul 