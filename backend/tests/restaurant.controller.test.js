import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/Restaurant.js', () => ({
  default: {
    exists: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn()
  }
}));

import Restaurant from '../src/models/Restaurant.js';
import {
  createRestaurant,
  listRestaurants
} from '../src/controllers/restaurant.controller.js';
import { createMockResponse } from './helpers/mockResponse.js';

describe('restaurant controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 409 when requested slug already exists', async () => {
    Restaurant.exists.mockResolvedValueOnce(true);

    const req = {
      body: {
        name: 'Spice Garden',
        slug: 'spice-garden'
      }
    };
    const res = createMockResponse();

    await createRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(Restaurant.create).not.toHaveBeenCalled();
  });

  it('creates restaurant with generated slug when slug is not provided', async () => {
    Restaurant.exists.mockResolvedValueOnce(false);
    Restaurant.create.mockResolvedValue({
      _id: 'r1',
      name: 'Spice Garden',
      slug: 'spice-garden'
    });

    const req = {
      body: {
        name: 'Spice Garden'
      }
    };
    const res = createMockResponse();

    await createRestaurant(req, res);

    expect(Restaurant.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Spice Garden',
        slug: 'spice-garden'
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('lists only active restaurants by default', async () => {
    const sort = vi.fn().mockResolvedValue([{ _id: 'r1' }]);
    Restaurant.find.mockReturnValue({ sort });

    const req = {
      query: {
        includeInactive: false
      }
    };
    const res = createMockResponse();

    await listRestaurants(req, res);

    expect(Restaurant.find).toHaveBeenCalledWith({ isActive: true });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
