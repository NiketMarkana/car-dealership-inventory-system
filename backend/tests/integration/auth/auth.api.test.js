const request = require('supertest');
const app = require('../../../src/app');
const {
  AUTH_MESSAGES,
} = require('../../../src/shared/constants/auth.messages');
const User = require('../../../src/modules/auth/auth.model');
const { hashPassword } = require('../../../src/shared/utils/password');

describe('Auth API Integration Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with 201 response', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(AUTH_MESSAGES.USER_REGISTERED);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe(testUser.name);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data).not.toHaveProperty('password'); // Verify password is excluded
    });

    it('should fail registration with 400 if validation rules are violated', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: '',
        email: 'invalid-email',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation Error');
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should fail registration with 409 if email already exists', async () => {
      // Arrange
      const hashedPassword = await hashPassword(testUser.password);
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
      });

      // Act
      const res = await request(app).post('/api/auth/register').send(testUser);

      // Assert
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await hashPassword(testUser.password);
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
      });
    });

    it('should login successfully and return JWT token with 200 response', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should fail login with 401 for incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should fail login with 400 for validation errors', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: '',
        password: '',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation Error');
    });
  });
});
