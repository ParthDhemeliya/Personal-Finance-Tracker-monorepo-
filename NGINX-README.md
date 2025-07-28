# Personal Finance Tracker with Nginx

This guide explains how to run your Personal Finance Tracker application with Nginx as a reverse proxy.

## What is Nginx?

Nginx is a web server that can also be used as a reverse proxy. In this setup, Nginx:
- Routes requests to the correct service (backend or frontend)
- Handles SSL/TLS termination (for HTTPS)
- Can provide load balancing when you scale your application

## How It Works

```
                   ┌─────────────┐
                   │             │
 User Request      │    Nginx    │
─────────────────► │  (Port 80)  │
                   │             │
                   └──────┬──────┘
                          │
                          ▼
         ┌────────────────┴───────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│                 │              │                 │
│  Backend API    │              │    Frontend     │
│  (Port 8000)    │              │   (Port 3000)   │
│                 │              │                 │
└────────┬────────┘              └─────────────────┘
         │
         ▼
┌─────────────────┐
│                 │
│    MongoDB      │
│  (Port 27017)   │
│                 │
└─────────────────┘
```

## Setup Instructions

### 1. Prerequisites

- Docker and Docker Compose installed on your machine

### 2. Environment Variables

Create a `.env` file in the root directory with:

```
MONGOURI=mongodb://mongo:27017/finance-tracker
JWT_SECRET=your_secret_key_here
```

### 3. Start the Application

Run the start script:

```
start-app.bat
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost
```

## Configuration Details

### Nginx Configuration

The Nginx configuration is located at:
```
Personal-Finance-Tracker-Backend/nginx/default.conf
```

Key parts:
- `/api/` requests are routed to the backend service
- All other requests are routed to the frontend service

### Docker Compose

The Docker Compose file sets up:
- Backend service (Node.js/Express)
- Frontend service (Next.js)
- Nginx service (reverse proxy)
- MongoDB service (database)

## Troubleshooting

### Check if containers are running:
```
docker-compose ps
```

### View logs:
```
docker-compose logs nginx
docker-compose logs backend
docker-compose logs frontend
```

### Restart services:
```
docker-compose restart nginx
```

## Stopping the Application

```
docker-compose down
```