import { Router } from 'express';
import healthRouter from './health.route.js';

const router = Router();

router.use('/health', healthRouter);

// Phase 1+ routes will be added here.
router.get('/v1', (_req, res) => {
  res.json({
    success: true,
    message: 'API base is ready for phase 1 implementation'
  });
});

export default router;
