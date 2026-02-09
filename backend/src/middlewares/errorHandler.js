import { fail } from '../utils/apiResponse.js';

export function notFoundHandler(req, res) {
  return fail(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  return fail(
    res,
    statusCode,
    err.message || 'Internal server error',
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
}
