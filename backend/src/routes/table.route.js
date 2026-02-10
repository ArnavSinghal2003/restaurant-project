import { Router } from 'express';

import {
  createTable,
  deleteTable,
  getTableById,
  listTables,
  updateTable
} from '../controllers/table.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createTableBodySchema,
  listTablesQuerySchema,
  restaurantIdParamSchema,
  tableIdParamSchema,
  updateTableBodySchema
} from '../validators/table.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const tableRouter = Router({ mergeParams: true });

tableRouter.post(
  '/',
  validateRequest({
    params: restaurantIdParamSchema,
    body: createTableBodySchema
  }),
  asyncHandler(createTable)
);

tableRouter.get(
  '/',
  validateRequest({
    params: restaurantIdParamSchema,
    query: listTablesQuerySchema
  }),
  asyncHandler(listTables)
);

tableRouter.get(
  '/:tableId',
  validateRequest({ params: tableIdParamSchema }),
  asyncHandler(getTableById)
);

tableRouter.patch(
  '/:tableId',
  validateRequest({
    params: tableIdParamSchema,
    body: updateTableBodySchema
  }),
  asyncHandler(updateTable)
);

tableRouter.delete(
  '/:tableId',
  validateRequest({ params: tableIdParamSchema }),
  asyncHandler(deleteTable)
);

export default tableRouter;
