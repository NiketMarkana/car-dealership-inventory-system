const { verifyToken } = require('../shared/utils/jwt');
const UnauthorizedError = require('../shared/errors/UnauthorizedError');
const ForbiddenError = require('../shared/errors/ForbiddenError');

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Not authorized, no token provided');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    next(new UnauthorizedError('Not authorized, invalid token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('User role is not authorized to access this route')
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
