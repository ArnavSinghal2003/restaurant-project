import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

describe('GET /api/health', () => {
  it('responds with healthy payload shape', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('serverTime');
    expect(response.body.data).toHaveProperty('database');
  });
});
