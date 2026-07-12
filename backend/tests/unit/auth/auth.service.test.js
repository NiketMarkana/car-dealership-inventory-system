/**
 * Unit tests for the Authentication Service.
 *
 * We are following strict Test-Driven Development (TDD).
 * In the RED phase, these tests are written before any implementation code
 * is added to auth.service.js. These tests will fail initially.
 */

const authService = require('../../../src/modules/auth/auth.service');
const userRepository = require('../../../src/modules/auth/auth.repository');

// Mock UserRepository
jest.mock('../../../src/modules/auth/auth.repository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn()
}));

describe('Auth Service - registerUser', () => {
  const userData = {
    name: 'Niket',
    email: '  Niket@Example.Com  ', // Input with spaces and mixed case to test normalization
    password: 'password123',
  };

  const normalizedEmail = 'niket@example.com';

  const mockCreatedUser = {
    id: 'mock-user-id',
    name: 'Niket',
    email: normalizedEmail,
    role: 'USER',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default resolve for password utility mock
    hashPassword.mockResolvedValue('mocked-hashed-password');
  });

  it('should register a new user successfully, normalize email, and return the user object', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    // Act
    const result = await authService.registerUser(userData);

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(normalizedEmail);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: normalizedEmail,
      })
    );
    expect(result).toEqual(mockCreatedUser);
  });

  it('should throw ConflictError and not create a user if email already exists', async () => {
    // Arrange: Mock findByEmail to return an existing user, indicating conflict
    userRepository.findByEmail.mockResolvedValue({
      id: 'existing-id',
      email: normalizedEmail,
    });

    // Act & Assert: Call service and expect it to throw ConflictError with correct message
    await expect(authService.registerUser(userData)).rejects.toThrow(
      AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
    );

    // Ensure repository.create is never called when email is taken
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the user password before saving using the password utility', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    // Act
    await authService.registerUser(userData);

    // Assert: Verify utility was called and returned hash was stored
    expect(hashPassword).toHaveBeenCalledWith(userData.password);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'mocked-hashed-password',
      })
    );
  });

  it('should assign the default role of USER to the new user', async () => {
    // Arrange
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    // Act
    await authService.registerUser(userData);

    // Assert: Check role assignment is defaulted to USER
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'USER',
      })
    );
  });
});

