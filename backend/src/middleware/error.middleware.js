const { sendError } = require('../shared/responses/apiResponse');
const { NODE_ENV } = require('../config/env');

/**
 * Global centralized error handler middleware for Express.
 * Decodes operational custom errors (AppError subclasses) and formats them cleanly.
 */
const errorMiddleware = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Log server/unexpected errors in development for debugging
  if (NODE_ENV !== 'production' && !err.isOperational) {
    console.error('[Error Trace]:', err);
  }

  // Mongoose Validation Error Mapping (Clean handling if database throws during save)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose Cast Error (Invalid object ID query)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
  }

  return sendError(res, message, statusCode, errors);
};

module.exports = errorMiddleware;
