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

jest.mock('../../../src/modules/auth/auth.repository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../../../src/shared/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../../../src/shared/utils/jwt', () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
}));

describe('Auth Service - registerUser', () => {
  const userData = {
    name: 'Niket',
    email: '  Niket@Example.Com  ',
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
    hashPassword.mockResolvedValue('mocked-hashed-password');
  });

  it('should register a new user successfully, normalize email, and return the user object', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    const result = await authService.registerUser(userData);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(normalizedEmail);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: normalizedEmail,
      })
    );
    expect(result).toEqual(mockCreatedUser);
  });

  it('should throw ConflictError and not create a user if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'existing-id',
      email: normalizedEmail,
    });

    await expect(authService.registerUser(userData)).rejects.toThrow(
      AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
    );
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the user password before saving using the password utility', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    await authService.registerUser(userData);

    expect(hashPassword).toHaveBeenCalledWith(userData.password);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'mocked-hashed-password',
      })
    );
  });

  it('should assign the default role of USER to the new user', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockCreatedUser);

    await authService.registerUser(userData);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'USER',
      })
    );
  });
});

describe('Auth Service - loginUser', () => {
  const loginData = {
    email: '  Niket@Example.Com  ',
    password: 'password123',
  };

  const normalizedEmail = 'niket@example.com';

  const mockUser = {
    id: 'mock-user-id',
    name: 'Niket',
    email: normalizedEmail,
    password: 'hashed-password',
    role: 'USER',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue('mock-jwt-token');
  });

  it('should login successfully, normalize email, verify password, and return user + token', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await authService.loginUser(
      loginData.email,
      loginData.password
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(normalizedEmail);
    expect(comparePassword).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(generateToken).toHaveBeenCalledWith({
      id: mockUser.id,
      role: mockUser.role,
    });
    expect(result).toEqual({
      user: mockUser,
      token: 'mock-jwt-token',
    });
  });

  it('should throw UnauthorizedError if user email is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.loginUser(loginData.email, loginData.password)
    ).rejects.toThrow(AUTH_MESSAGES.INVALID_CREDENTIALS);
    expect(comparePassword).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError if password comparison fails', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(false);

    await expect(
      authService.loginUser(loginData.email, loginData.password)
    ).rejects.toThrow(AUTH_MESSAGES.INVALID_CREDENTIALS);
    expect(generateToken).not.toHaveBeenCalled();
  });
});
