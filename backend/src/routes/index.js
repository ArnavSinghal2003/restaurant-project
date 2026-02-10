import { Router } from 'express';
import healthRouter from './health.route.js';
import restaurantRouter from './restaurant.route.js';
import tableRouter from './table.route.js';
import menuItemRouter from './menuItem.route.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/v1/restaurants', restaurantRouter);
router.use('/v1/restaurants/:restaurantId/tables', tableRouter);
router.use('/v1/restaurants/:restaurantId/menu-items', menuItemRouter);

// Phase 1+ routes will be added here.
router.get('/v1', (_req, res) => {
  res.json({
    success: true,
    message: 'API base is ready for phase 1 implementation'
  });
});

export default router;
