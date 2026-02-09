export function ok(res, payload, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data: payload
  });
}

export function created(res, payload, message = 'Created') {
  return res.status(201).json({
    success: true,
    message,
    data: payload
  });
}

export function fail(res, statusCode, message, details = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    details
  });
}
