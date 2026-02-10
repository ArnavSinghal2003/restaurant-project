import crypto from 'crypto';

import { env } from '../config/env.js';
import Restaurant from '../models/Restaurant.js';
import Session from '../models/Session.js';
import Table from '../models/Table.js';
import { created, fail, ok } from '../utils/apiResponse.js';

function getSessionExpiryDate(baseTime = new Date()) {
  return new Date(baseTime.getTime() + env.SESSION_TTL_MINUTES * 60 * 1000);
}

function touchSession(session, now = new Date()) {
  session.lastActivityAt = now;
  session.expiresAt = getSessionExpiryDate(now);
}

async function generateUniqueSessionToken() {
  let sessionToken = crypto.randomBytes(24).toString('hex');

  while (await Session.exists({ sessionToken })) {
    sessionToken = crypto.randomBytes(24).toString('hex');
  }

  return sessionToken;
}

async function findValidSessionOrFail(sessionToken, res) {
  const now = new Date();
  const session = await Session.findOne({ sessionToken });

  if (!session) {
    return { session: null, response: fail(res, 404, 'Session not found') };
  }

  if (session.status !== 'active') {
    return { session: null, response: fail(res, 410, 'Session is not active') };
  }

  if (session.expiresAt <= now) {
    session.status = 'expired';
    await session.save();
    return { session: null, response: fail(res, 410, 'Session has expired') };
  }

  return { session, now, response: null };
}

export async function createOrJoinSession(req, res) {
  const { qrToken, mode = 'collective' } = req.body;
  const now = new Date();

  const table = await Table.findOne({ qrToken, isActive: true });
  if (!table) {
    return fail(res, 404, 'Table not found for provided QR token');
  }

  const restaurant = await Restaurant.findById(table.restaurantId).select(
    'name slug currency isActive'
  );
  if (!restaurant) {
    return fail(res, 404, 'Restaurant not found for this table');
  }

  const existingSession = await Session.findOne({
    restaurantId: table.restaurantId,
    tableId: table._id,
    status: 'active',
    expiresAt: { $gt: now }
  }).sort({ createdAt: -1 });

  if (existingSession) {
    touchSession(existingSession, now);
    await existingSession.save();

    return ok(
      res,
      {
        session: existingSession,
        restaurant,
        table: {
          _id: table._id,
          tableNumber: table.tableNumber
        },
        restaurantId: table.restaurantId,
        isNew: false
      },
      'Joined active table session'
    );
  }

  const sessionToken = await generateUniqueSessionToken();
  const session = await Session.create({
    restaurantId: table.restaurantId,
    tableId: table._id,
    sessionToken,
    mode,
    participants: [],
    cartSnapshot: { items: [] },
    status: 'active',
    expiresAt: getSessionExpiryDate(now),
    lastActivityAt: now
  });

  return created(
    res,
      {
        session,
        restaurant,
        table: {
          _id: table._id,
          tableNumber: table.tableNumber
        },
      restaurantId: table.restaurantId,
      isNew: true
    },
    'Table session created'
  );
}

export async function getSessionByToken(req, res) {
  const { sessionToken } = req.params;
  const { session, now, response } = await findValidSessionOrFail(sessionToken, res);
  if (response) return response;

  touchSession(session, now);
  await session.save();

  const table = await Table.findById(session.tableId).select('tableNumber qrToken isActive');
  const restaurant = await Restaurant.findById(session.restaurantId).select(
    'name slug currency isActive'
  );

  return ok(
    res,
    {
      session,
      table,
      restaurant
    },
    'Session fetched'
  );
}

export async function addSessionParticipant(req, res) {
  const { sessionToken } = req.params;
  const { name } = req.body;
  const { session, now, response } = await findValidSessionOrFail(sessionToken, res);
  if (response) return response;

  const normalizedName = name.trim();
  const existingParticipant = session.participants.find(
    (participant) => participant.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (!existingParticipant) {
    session.participants.push({ name: normalizedName, joinedAt: now });
  }

  touchSession(session, now);
  await session.save();

  return ok(
    res,
    {
      sessionToken: session.sessionToken,
      participants: session.participants
    },
    existingParticipant ? 'Participant already exists' : 'Participant added'
  );
}

export async function updateSessionMode(req, res) {
  const { sessionToken } = req.params;
  const { mode } = req.body;
  const { session, now, response } = await findValidSessionOrFail(sessionToken, res);
  if (response) return response;

  session.mode = mode;
  touchSession(session, now);
  await session.save();

  return ok(
    res,
    {
      sessionToken: session.sessionToken,
      mode: session.mode
    },
    'Session mode updated'
  );
}
