/**
 * Unit tests for the Authentication Service.
 * 
 * We are following strict Test-Driven Development (TDD).
 * In the RED phase, these tests are written before any implementation code
 * is added to auth.service.js. These tests will fail initially.
 */

const authService = require('../../../src/modules/auth/auth.service');
const userRepository = require('../../../src/modules/auth/auth.repository');

// Manually mock the UserRepository methods we plan to use.
// This decouples our service tests from the actual database/model layer.
jest.mock('../../../src/modules/auth/auth.repository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn()
}));

describe('Auth Service - registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    // 1. Arrange: Setup input data and expected database responses
    const userData = {
      name: 'Niket',
      email: 'niket@example.com',
      password: 'password123'
    };

    const mockCreatedUser = {
      id: 'mock-user-id',
      name: 'Niket',
      email: 'niket@example.com',
      role: 'USER'
    };

    // Mock findByEmail to return null (meaning email is not taken yet)
    userRepository.findByEmail.mockResolvedValue(null);
    // Mock create to return the successfully saved user object
    userRepository.create.mockResolvedValue(mockCreatedUser);

    // 2. Act: Call the service method (expected to fail right now because it is not implemented)
    const result = await authService.registerUser(userData);

    // 3. Assert: Verify the business rules are followed
    // Check that we checked email uniqueness in the repository
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);

    // Verify repository.create was called with user details
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: userData.name,
        email: userData.email,
        role: 'USER' // Assert default role is USER
      })
    );

    // Assert that the raw password was not passed directly (it should be hashed)
    const createCallArgs = userRepository.create.mock.calls[0][0];
    expect(createCallArgs.password).not.toBe(userData.password);
    expect(createCallArgs.password.length).toBeGreaterThan(0);

    // Assert the service returns the created user object
    expect(result).toEqual(mockCreatedUser);
  });
});
