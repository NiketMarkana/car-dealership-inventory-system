/**
 * Unit tests for the Authentication Service.
 *
 * We are following strict Test-Driven Development (TDD).
 * These tests cover the registration and login flows in isolation by mocking dependencies.
 */

const authService = require('../../../src/modules/auth/auth.service');
const userRepository = require('../../../src/modules/auth/auth.repository');

const {
  AUTH_MESSAGES,
} = require('../../../src/shared/constants/auth.messages');

const {
  hashPassword,
  comparePassword,
} = require('../../../src/shared/utils/password');

const { generateToken } = require('../../../src/shared/utils/jwt');