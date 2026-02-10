import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/Restaurant.js', () => ({
  default: {
    exists: vi.fn()
  }
}));

vi.mock('../src/models/Table.js', () => ({
  default: {
    exists: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndDelete: vi.fn()
  }
}));

import Restaurant from '../src/models/Restaurant.js';
import Table from '../src/models/Table.js';
import {
  createTable,
  listTables
} from '../src/controllers/table.controller.js';
import { createMockResponse } from './helpers/mockResponse.js';

describe('table controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 409 when duplicate table number exists for restaurant', async () => {
    Restaurant.exists.mockResolvedValue(true);
    Table.exists.mockResolvedValueOnce(true);

    const req = {
      params: { restaurantId: '507f1f77bcf86cd799439011' },
      body: { tableNumber: 'A1', capacity: 4 }
    };
    const res = createMockResponse();

    await createTable(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(Table.create).not.toHaveBeenCalled();
  });

  it('creates table when payload is valid', async () => {
    Restaurant.exists.mockResolvedValue(true);
    Table.exists.mockResolvedValueOnce(false);
    Table.exists.mockResolvedValueOnce(false);
    Table.create.mockResolvedValue({
      _id: 't1',
      restaurantId: '507f1f77bcf86cd799439011',
      tableNumber: 'A1',
      capacity: 4,
      qrToken: 'manual-token-123'
    });

    const req = {
      params: { restaurantId: '507f1f77bcf86cd799439011' },
      body: {
        tableNumber: 'A1',
        capacity: 4,
        qrToken: 'manual-token-123'
      }
    };
    const res = createMockResponse();

    await createTable(req, res);

    expect(Table.create).toHaveBeenCalledWith(
      expect.objectContaining({
        restaurantId: '507f1f77bcf86cd799439011',
        tableNumber: 'A1',
        qrToken: 'manual-token-123'
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('lists active tables by default', async () => {
    Restaurant.exists.mockResolvedValue(true);
    const sort = vi.fn().mockResolvedValue([{ _id: 't1' }]);
    Table.find.mockReturnValue({ sort });

    const req = {
      params: { restaurantId: '507f1f77bcf86cd799439011' },
      query: { includeInactive: false }
    };
    const res = createMockResponse();

    await listTables(req, res);

    expect(Table.find).toHaveBeenCalledWith({
      restaurantId: '507f1f77bcf86cd799439011',
      isActive: true
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
