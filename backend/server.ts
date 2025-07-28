/* eslint-env node */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import run from './config/db.js';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import incomeRoutes from './src/modules/income/income.routes.js';
import rootRoute from './src/routes/root.route.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import expenseRoutes from './src/modules/expense/expense.routes.js';
import transactionRoutes from './src/modules/transaction/transaction.routes.js';
import balanceRoutes from './src/modules/balance/balance.routes.js';
import budgetRoutes from './src/modules/budget/budget.routes.js';
import categoryRoutes from './src/modules/category/category.routes.js';
import savingsRoutes from './src/modules/savings/savings.routes.js';
import { globalErrorHandler } from './src/middlewares/error.middleware.js';
import responseTime from 'response-time';
import {
  httpRequestCounter,
  httpRequestDurationMicroseconds,
  register,
  reqResTime,
} from './src/utils/metrics.js';

dotenv.config();
console.log('Port', Number(process.env.PORT));
const port = Number(process.env.PORT) || 5000;

const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://personal-finance-tracker-frontend-8pxf3itg9.vercel.app',
  'https://personal-finance-tracker-inky-three.vercel.app',
];

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'development'
      ? true
      : (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          console.log('Incoming request origin:', origin);
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

//  Metrics Middleware (records every request)
app.use((req, res, next) => {
  const startEpoch = Date.now();

  res.on('finish', () => {
    const responseTimeInSeconds = (Date.now() - startEpoch) / 1000;
    const route = (req as any).route?.path || req.path;

    httpRequestDurationMicroseconds.observe(
      { method: req.method, route, status_code: res.statusCode },
      responseTimeInSeconds,
    );

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });

  next();
});

// Response time middleware
app.use(
  responseTime((req, res, time) => {
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode,
      })
      .observe(time / 1000); // Convert milliseconds to seconds
  }),
);

// Routes
app.use('/', rootRoute);
app.use('/api/auth', authRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/balance', balanceRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/savings-goal', savingsRoutes);

//  Metrics Endpoint (for Prometheus)
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    mongodb:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Error handler
app.use(globalErrorHandler);

// Start server after DB connection
run()
  .then(() => {
    app.listen(port, () => {
      console.log(
        chalk.cyanBright(`🚀 Server is running on http://localhost:${port}`),
      );
      console.log(chalk.magenta(`📦 API Base: /api`));
    });
  })
  .catch((_err: unknown) => {
    console.log('db connection error', _err);
    process.exit(1);
  });
