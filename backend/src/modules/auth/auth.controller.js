const authService = require('./auth.service');
const {
  sendCreated,
  sendSuccess,
} = require('../../shared/responses/apiResponse');
const { AUTH_MESSAGES } = require('../../shared/constants/auth.messages');

/**
 * Handle user registration request.
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return sendCreated(res, AUTH_MESSAGES.USER_REGISTERED, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login request.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return sendSuccess(res, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
