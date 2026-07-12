const NotFoundError = require('../shared/errors/NotFoundError');

/**
 * Intercept requests to undefined routes and propagate a NotFoundError.
 */
const notFoundMiddleware = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = notFoundMiddleware;
