import { Router } from 'express';
import mongoose from 'mongoose';
import { ok } from '../utils/apiResponse.js';

const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const isDatabaseUp = mongoose.connection.readyState === 1;

  return ok(
    res,
    {
      serverTime: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      database: isDatabaseUp ? 'connected' : 'disconnected'
    },
    'Backend is healthy'
  );
});

export default healthRouter;
