@echo off
echo Starting Personal Finance Tracker with Nginx...

echo Building and starting containers...
docker-compose up -d

echo Application is now running!
echo Access your application at http://localhost
pause