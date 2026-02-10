import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/Restaurant.js', () => ({
  default: {
    exists: vi.fn()
  }
}));

vi.mock('../src/models/MenuItem.js', () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndDelete: vi.fn()
  }
}));

import Restaurant from '../src/models/Restaurant.js';
import MenuItem from '../src/models/MenuItem.js';
import {
  createMenuItem,
  listMenuItems,
  updateMenuItemAvailability
} from '../src/controllers/menuItem.controller.js';
import { createMockResponse } from './helpers/mockResponse.js';

describe('menu item controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates menu item scoped to the given restaurant', async () => {
    Restaurant.exists.mockResolvedValue(true);
    MenuItem.create.mockResolvedValue({
      _id: 'm1',
      restaurantId: '507f1f77bcf86cd799439011',
      name: 'Paneer Tikka'
    });

    const req = {
      params: { restaurantId: '507f1f77bcf86cd799439011' },
      body: {
        name: 'Paneer Tikka',
        category: 'Starters',
        price: 299
      }
    };
    const res = createMockResponse();

    await createMenuItem(req, res);

    expect(MenuItem.create).toHaveBeenCalledWith(
      expect.objectContaining({
        restaurantId: '507f1f77bcf86cd799439011',
        name: 'Paneer Tikka'
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('lists only available items by default and applies filters', async () => {
    Restaurant.exists.mockResolvedValue(true);
    const sort = vi.fn().mockResolvedValue([{ _id: 'm1' }]);
    MenuItem.find.mockReturnValue({ sort });

    const req = {
      params: { restaurantId: '507f1f77bcf86cd799439011' },
      query: {
        includeUnavailable: false,
        category: 'Starters',
        search: 'paneer'
      }
    };
    const res = createMockResponse();

    await listMenuItems(req, res);

    expect(MenuItem.find).toHaveBeenCalledWith(
      expect.objectContaining({
        restaurantId: '507f1f77bcf86cd799439011',
        isAvailable: true,
        category: 'Starters'
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when updating availability of missing menu item', async () => {
    MenuItem.findOne.mockResolvedValue(null);

    const req = {
      params: {
        restaurantId: '507f1f77bcf86cd799439011',
        menuItemId: '507f1f77bcf86cd799439022'
      },
      body: {
        isAvailable: false
      }
    };
    const res = createMockResponse();

    await updateMenuItemAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
