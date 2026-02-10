import { describe, expect, it } from 'vitest';

import { healthHandler } from '../src/routes/health.route.js';
import { createMockResponse } from './helpers/mockResponse.js';

describe('healthHandler', () => {
  it('responds with healthy payload shape', () => {
    const res = createMockResponse();
    healthHandler({}, res);
    const jsonPayload = res.json.mock.calls[0][0];

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonPayload.success).toBe(true);
    expect(jsonPayload.data).toHaveProperty('serverTime');
    expect(jsonPayload.data).toHaveProperty('database');
  });
});
