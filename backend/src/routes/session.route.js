import { Router } from 'express';

import {
  addSessionParticipant,
  createOrJoinSession,
  getSessionByToken,
  updateSessionMode
} from '../controllers/session.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createSessionBodySchema,
  participantBodySchema,
  sessionTokenParamSchema,
  updateSessionModeBodySchema
} from '../validators/session.validator.js';

const sessionRouter = Router();

sessionRouter.post(
  '/create',
  validateRequest({ body: createSessionBodySchema }),
  asyncHandler(createOrJoinSession)
);

sessionRouter.get(
  '/:sessionToken',
  validateRequest({ params: sessionTokenParamSchema }),
  asyncHandler(getSessionByToken)
);

sessionRouter.post(
  '/:sessionToken/participants',
  validateRequest({
    params: sessionTokenParamSchema,
    body: participantBodySchema
  }),
  asyncHandler(addSessionParticipant)
);

sessionRouter.patch(
  '/:sessionToken/mode',
  validateRequest({
    params: sessionTokenParamSchema,
    body: updateSessionModeBodySchema
  }),
  asyncHandler(updateSessionMode)
);

export default sessionRouter;
