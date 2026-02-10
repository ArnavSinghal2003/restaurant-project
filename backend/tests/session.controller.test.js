import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/Table.js', () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn()
  }
}));

vi.mock('../src/models/Session.js', () => ({
  default: {
    exists: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

import Table from '../src/models/Table.js';
import Session from '../src/models/Session.js';
import {
  addSessionParticipant,
  createOrJoinSession,
  getSessionByToken,
  updateSessionMode
} from '../src/controllers/session.controller.js';
import { createMockResponse } from './helpers/mockResponse.js';

describe('session controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when qr token does not map to an active table', async () => {
    Table.findOne.mockResolvedValue(null);

    const req = {
      body: { qrToken: 'missing-table-token' }
    };
    const res = createMockResponse();

    await createOrJoinSession(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('joins existing active session for a table', async () => {
    const table = {
      _id: 't1',
      tableNumber: 'A1',
      restaurantId: 'r1'
    };

    const existingSession = {
      _id: 's1',
      sessionToken: 'existing-token',
      status: 'active',
      expiresAt: new Date(Date.now() + 60_000),
      save: vi.fn()
    };

    Table.findOne.mockResolvedValue(table);
    const sort = vi.fn().mockResolvedValue(existingSession);
    Session.findOne.mockReturnValue({ sort });

    const req = {
      body: { qrToken: 'table-token', mode: 'collective' }
    };
    const res = createMockResponse();

    await createOrJoinSession(req, res);

    expect(existingSession.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('creates a new session when no active session exists', async () => {
    const table = {
      _id: 't1',
      tableNumber: 'A1',
      restaurantId: 'r1'
    };

    Table.findOne.mockResolvedValue(table);
    const sort = vi.fn().mockResolvedValue(null);
    Session.findOne.mockReturnValue({ sort });
    Session.exists.mockResolvedValue(false);
    Session.create.mockResolvedValue({
      _id: 's2',
      tableId: 't1',
      restaurantId: 'r1',
      sessionToken: 'new-token'
    });

    const req = {
      body: { qrToken: 'table-token', mode: 'individual' }
    };
    const res = createMockResponse();

    await createOrJoinSession(req, res);

    expect(Session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tableId: 't1',
        restaurantId: 'r1',
        mode: 'individual'
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 410 when fetching an expired session', async () => {
    Session.findOne.mockResolvedValue({
      _id: 's-expired',
      status: 'active',
      expiresAt: new Date(Date.now() - 5_000),
      save: vi.fn()
    });

    const req = {
      params: { sessionToken: 'expired-token' }
    };
    const res = createMockResponse();

    await getSessionByToken(req, res);

    expect(res.status).toHaveBeenCalledWith(410);
  });

  it('adds participant to active session', async () => {
    const session = {
      _id: 's1',
      sessionToken: 'active-token',
      status: 'active',
      expiresAt: new Date(Date.now() + 120_000),
      participants: [],
      save: vi.fn()
    };

    Session.findOne.mockResolvedValue(session);

    const req = {
      params: { sessionToken: 'active-token' },
      body: { name: 'Arnav' }
    };
    const res = createMockResponse();

    await addSessionParticipant(req, res);

    expect(session.participants).toHaveLength(1);
    expect(session.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updates mode for active session', async () => {
    const session = {
      _id: 's1',
      sessionToken: 'active-token',
      mode: 'collective',
      status: 'active',
      expiresAt: new Date(Date.now() + 120_000),
      save: vi.fn()
    };

    Session.findOne.mockResolvedValue(session);

    const req = {
      params: { sessionToken: 'active-token' },
      body: { mode: 'individual' }
    };
    const res = createMockResponse();

    await updateSessionMode(req, res);

    expect(session.mode).toBe('individual');
    expect(session.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
