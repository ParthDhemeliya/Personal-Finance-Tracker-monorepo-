# Personal Finance Tracker - Full Stack Application

A comprehensive personal finance management application built with modern technologies and DevOps practices.

## 🏗️ Architecture

This is a **monorepo** containing both frontend and backend applications with complete DevOps infrastructure.

```
Personal-Finance-Tracker/
├── backend/                 # Node.js/Express API
├── frontend/               # Next.js React Application  
├── docs/                   # Documentation & Demo Reports
├── docker-compose.yml      # Multi-service orchestration
├── nginx.conf             # Load balancer configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### One-Command Deployment
```bash
# Build and start all services
docker-compose -p finance-demo up -d
```

### Access Points
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5050
- **API Health**: http://localhost:5050/health
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3003 (admin/admin)

## 📊 Services

| Service | Technology | Port | Description |
|---------|------------|------|-------------|
| Frontend | Next.js 15 | 3000 | React web application |
| Backend | Node.js/Express | 5050 | RESTful API server |
| Database | MongoDB 6 | 27017 | Document database |
| Load Balancer | Nginx | 80 | Reverse proxy |
| Monitoring | Prometheus | 9090 | Metrics collection |
| Dashboards | Grafana | 3003 | Data visualization |

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development  
```bash
cd frontend
npm install
npm run dev
```

## 📈 Features

### Application Features
- ✅ User Authentication (JWT)
- ✅ Expense & Income Tracking
- ✅ Financial Dashboard with Charts
- ✅ Category-wise Analysis
- ✅ Real-time Balance Calculations
- ✅ Savings Goals Management

### DevOps Features
- ✅ **Containerization**: Docker multi-stage builds
- ✅ **Load Balancing**: Nginx reverse proxy
- ✅ **Monitoring**: Prometheus + Grafana stack
- ✅ **High Availability**: Service replication
- ✅ **Health Checks**: Automated monitoring
- ✅ **Observability**: Real-time metrics

## 🔧 Configuration

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**:
```env
MONGOURI=mongodb://mongo:27017/finance-tracker
JWT_SECRET=your_jwt_secret_here
PORT=5050
NODE_ENV=production
```

**Frontend (.env)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

## 📊 Monitoring

### Metrics Available
- HTTP request counts and response times
- Memory and CPU usage
- Database connection status
- Custom business metrics

### Grafana Dashboards
- Application performance metrics
- System resource monitoring
- Error rate tracking
- Custom alerting rules

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:watch
```

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
cd frontend && npm run build
docker build -t your-registry/finance-frontend:latest .

cd ../backend && npm run build  
docker build -t your-registry/finance-backend:latest .

# Deploy with production compose
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling Services
```bash
# Scale frontend replicas
docker-compose up -d --scale frontend=3

# Scale backend replicas  
docker-compose up -d --scale backend=2
```

## 📁 Project Structure

```
Personal-Finance-Tracker/
├── backend/
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   ├── middlewares/      # Express middlewares
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── tests/               # Test files
│   ├── grafana/            # Grafana configuration
│   ├── prometheus/         # Prometheus configuration
│   └── Dockerfile          # Backend container
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── redux/          # State management
│   │   └── types/          # TypeScript types
│   └── Dockerfile          # Frontend container
├── docs/                   # Documentation
├── docker-compose.yml      # Development services
└── nginx.conf             # Load balancer config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Parth Dhemeliya**
- GitHub: [@ParthDhemeliya](https://github.com/ParthDhemeliya)

---

*Built with ❤️ using modern web technologies and DevOps best practices*