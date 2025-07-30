@echo off
echo Starting Docker containers with fixed cAdvisor configuration...
docker-compose down
docker rm -f cadvisor 2>nul
docker-compose up -d
echo.
echo cAdvisor should now show per-container metrics at http://localhost:8081
echo Check Prometheus at http://localhost:9090 for container_cpu_usage_seconds_total
pause