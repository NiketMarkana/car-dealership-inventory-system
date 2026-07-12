const userRepository = require('./auth.repository');
const ConflictError = require('../../shared/errors/ConflictError');
const UnauthorizedError = require('../../shared/errors/UnauthorizedError');
const { ROLES } = require('./auth.constants');
const { AUTH_MESSAGES } = require('../../shared/constants/auth.messages');
const {
  hashPassword,
  comparePassword,
} = require('../../shared/utils/password');
const { generateToken } = require('../../shared/utils/jwt');

/**
 * Register a new user in the system.
 *
 * @param {Object} userData - User registration payload
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<Object>} The created user instance
 * @throws {ConflictError} if the email is already in use
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Normalize email to ensure consistency in lookups and storage
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check whether email already exists
  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) {
    throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  // 2. Hash password using decoupled hashing utility
  const hashedPassword = await hashPassword(password);

  // 3. Create the user with default USER role
  const user = await userRepository.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: ROLES.USER,
  });

  return user;
};

/**
 * Authenticate a user by credentials and generate a session token.
 *
 * @param {string} email - Plain text user email
 * @param {string} password - Plain text user password
 * @returns {Promise<Object>} Object containing user details and signed JWT token
 * @throws {UnauthorizedError} if credentials do not match
 */
const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Find user by email
  const user = await userRepository.findByEmail(normalizedEmail);
  if (!user) {
    throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // 2. Validate password
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // 3. Generate access token
  const token = generateToken({ id: user.id || user._id, role: user.role });

  return {
    user,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
