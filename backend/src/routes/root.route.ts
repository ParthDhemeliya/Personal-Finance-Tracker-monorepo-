import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Personal Finance Tracker API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      auth: '/api/auth',
      api: '/api/v1'
    }
  });
});

export default router;
