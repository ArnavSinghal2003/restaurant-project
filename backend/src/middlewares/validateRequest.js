import { fail } from '../utils/apiResponse.js';

function normalizeZodErrors(parsedResult) {
  const fieldErrors = parsedResult.error.flatten().fieldErrors;
  const formErrors = parsedResult.error.flatten().formErrors;

  return {
    ...fieldErrors,
    _form: formErrors
  };
}

export function validateRequest({ body, params, query } = {}) {
  return (req, res, next) => {
    const details = {};

    if (body) {
      const parsedBody = body.safeParse(req.body);
      if (!parsedBody.success) {
        details.body = normalizeZodErrors(parsedBody);
      } else {
        req.body = parsedBody.data;
      }
    }

    if (params) {
      const parsedParams = params.safeParse(req.params);
      if (!parsedParams.success) {
        details.params = normalizeZodErrors(parsedParams);
      } else {
        req.params = parsedParams.data;
      }
    }

    if (query) {
      const parsedQuery = query.safeParse(req.query);
      if (!parsedQuery.success) {
        details.query = normalizeZodErrors(parsedQuery);
      } else {
        req.query = parsedQuery.data;
      }
    }

    if (Object.keys(details).length > 0) {
      return fail(res, 400, 'Validation failed', details);
    }

    return next();
  };
}
