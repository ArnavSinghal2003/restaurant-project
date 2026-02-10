import crypto from 'crypto';

import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';
import { created, fail, ok } from '../utils/apiResponse.js';

async function ensureRestaurantExists(restaurantId) {
  return Restaurant.exists({ _id: restaurantId, isActive: true });
}

async function generateUniqueQrToken() {
  let token = crypto.randomBytes(16).toString('hex');

  while (await Table.exists({ qrToken: token })) {
    token = crypto.randomBytes(16).toString('hex');
  }

  return token;
}

export async function createTable(req, res) {
  const { restaurantId } = req.params;
  const payload = req.body;

  const restaurantExists = await ensureRestaurantExists(restaurantId);
  if (!restaurantExists) {
    return fail(res, 404, 'Restaurant not found or inactive');
  }

  const duplicateTableNumber = await Table.exists({
    restaurantId,
    tableNumber: payload.tableNumber
  });

  if (duplicateTableNumber) {
    return fail(res, 409, 'Table number already exists for this restaurant');
  }

  if (payload.qrToken) {
    const duplicateQrToken = await Table.exists({ qrToken: payload.qrToken });
    if (duplicateQrToken) {
      return fail(res, 409, 'QR token already exists. Provide a unique token');
    }
  }

  const table = await Table.create({
    ...payload,
    restaurantId,
    qrToken: payload.qrToken || (await generateUniqueQrToken())
  });

  return created(res, table, 'Table created');
}

export async function listTables(req, res) {
  const { restaurantId } = req.params;
  const { includeInactive } = req.query;

  const restaurantExists = await ensureRestaurantExists(restaurantId);
  if (!restaurantExists) {
    return fail(res, 404, 'Restaurant not found or inactive');
  }

  const filters = { restaurantId };

  if (!includeInactive) {
    filters.isActive = true;
  }

  const tables = await Table.find(filters).sort({ tableNumber: 1, createdAt: 1 });

  return ok(
    res,
    {
      items: tables,
      count: tables.length
    },
    'Tables fetched'
  );
}

export async function getTableById(req, res) {
  const { restaurantId, tableId } = req.params;

  const table = await Table.findOne({
    _id: tableId,
    restaurantId
  });

  if (!table) {
    return fail(res, 404, 'Table not found');
  }

  return ok(res, table, 'Table fetched');
}

export async function updateTable(req, res) {
  const { restaurantId, tableId } = req.params;
  const payload = req.body;

  const table = await Table.findOne({
    _id: tableId,
    restaurantId
  });

  if (!table) {
    return fail(res, 404, 'Table not found');
  }

  if (payload.tableNumber && payload.tableNumber !== table.tableNumber) {
    const duplicateTableNumber = await Table.exists({
      restaurantId,
      tableNumber: payload.tableNumber,
      _id: { $ne: tableId }
    });

    if (duplicateTableNumber) {
      return fail(res, 409, 'Table number already exists for this restaurant');
    }
  }

  if (payload.qrToken && payload.qrToken !== table.qrToken) {
    const duplicateQrToken = await Table.exists({
      qrToken: payload.qrToken,
      _id: { $ne: tableId }
    });

    if (duplicateQrToken) {
      return fail(res, 409, 'QR token already exists. Provide a unique token');
    }
  }

  Object.assign(table, payload);
  await table.save();

  return ok(res, table, 'Table updated');
}

export async function deleteTable(req, res) {
  const { restaurantId, tableId } = req.params;

  const table = await Table.findOneAndDelete({
    _id: tableId,
    restaurantId
  });

  if (!table) {
    return fail(res, 404, 'Table not found');
  }

  return ok(
    res,
    {
      _id: table._id
    },
    'Table deleted'
  );
}
