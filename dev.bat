@echo off
echo Starting development environment...
docker-compose -f docker-compose.dev.yml -p finance-dev up -d --build
echo.
echo Development environment started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5050
echo Grafana: http://localhost:3003
echo.
echo To view logs: docker-compose -f docker-compose.dev.yml -p finance-dev logs -f
echo To stop: docker-compose -f docker-compose.dev.yml -p finance-dev down