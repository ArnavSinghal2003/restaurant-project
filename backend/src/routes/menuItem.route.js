import { Router } from 'express';

import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  listMenuItems,
  updateMenuItem,
  updateMenuItemAvailability
} from '../controllers/menuItem.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createMenuItemBodySchema,
  listMenuItemsQuerySchema,
  menuItemIdParamSchema,
  restaurantIdParamSchema,
  updateAvailabilityBodySchema,
  updateMenuItemBodySchema
} from '../validators/menuItem.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const menuItemRouter = Router({ mergeParams: true });

menuItemRouter.post(
  '/',
  validateRequest({
    params: restaurantIdParamSchema,
    body: createMenuItemBodySchema
  }),
  asyncHandler(createMenuItem)
);

menuItemRouter.get(
  '/',
  validateRequest({
    params: restaurantIdParamSchema,
    query: listMenuItemsQuerySchema
  }),
  asyncHandler(listMenuItems)
);

menuItemRouter.get(
  '/:menuItemId',
  validateRequest({ params: menuItemIdParamSchema }),
  asyncHandler(getMenuItemById)
);

menuItemRouter.patch(
  '/:menuItemId',
  validateRequest({
    params: menuItemIdParamSchema,
    body: updateMenuItemBodySchema
  }),
  asyncHandler(updateMenuItem)
);

menuItemRouter.patch(
  '/:menuItemId/availability',
  validateRequest({
    params: menuItemIdParamSchema,
    body: updateAvailabilityBodySchema
  }),
  asyncHandler(updateMenuItemAvailability)
);

menuItemRouter.delete(
  '/:menuItemId',
  validateRequest({ params: menuItemIdParamSchema }),
  asyncHandler(deleteMenuItem)
);

export default menuItemRouter;
