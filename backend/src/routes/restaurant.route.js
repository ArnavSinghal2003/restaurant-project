import { Router } from 'express';

import {
  createRestaurant,
  deactivateRestaurant,
  getRestaurantById,
  getRestaurantBySlug,
  listRestaurants,
  updateRestaurant
} from '../controllers/restaurant.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createRestaurantBodySchema,
  listRestaurantsQuerySchema,
  restaurantIdParamSchema,
  restaurantSlugParamSchema,
  updateRestaurantBodySchema
} from '../validators/restaurant.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const restaurantRouter = Router();

restaurantRouter.post(
  '/',
  validateRequest({ body: createRestaurantBodySchema }),
  asyncHandler(createRestaurant)
);

restaurantRouter.get(
  '/',
  validateRequest({ query: listRestaurantsQuerySchema }),
  asyncHandler(listRestaurants)
);

restaurantRouter.get(
  '/slug/:slug',
  validateRequest({ params: restaurantSlugParamSchema }),
  asyncHandler(getRestaurantBySlug)
);

restaurantRouter.get(
  '/:restaurantId',
  validateRequest({ params: restaurantIdParamSchema }),
  asyncHandler(getRestaurantById)
);

restaurantRouter.patch(
  '/:restaurantId',
  validateRequest({
    params: restaurantIdParamSchema,
    body: updateRestaurantBodySchema
  }),
  asyncHandler(updateRestaurant)
);

restaurantRouter.delete(
  '/:restaurantId',
  validateRequest({ params: restaurantIdParamSchema }),
  asyncHandler(deactivateRestaurant)
);

export default restaurantRouter;
