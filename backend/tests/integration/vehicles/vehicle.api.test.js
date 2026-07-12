const request = require('supertest');
const app = require('../../../src/app');
const Vehicle = require('../../../src/modules/vehicles/vehicle.model');
const { generateToken } = require('../../../src/shared/utils/jwt');

describe('Vehicle API Integration Tests', () => {
  let userToken;
  let adminToken;
  let sampleVehicle;

  const testVehiclePayload = {
    make: 'Honda',
    model: 'Civic',
    category: 'SEDAN',
    price: 1500000,
    quantity: 10,
  };

  beforeEach(async () => {
    // Generate valid JWT tokens for tests
    userToken = generateToken({ id: 'user-id-123', role: 'USER' });
    adminToken = generateToken({ id: 'admin-id-456', role: 'ADMIN' });

    // Seed database with a sample vehicle record
    sampleVehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Fortuner',
      category: 'SUV',
      price: 3500000,
      quantity: 5,
    });
  });

  describe('POST /api/vehicles', () => {
    it('should allow a logged-in user to create a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testVehiclePayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe(testVehiclePayload.make);
      expect(res.body.data.model).toBe(testVehiclePayload.model);
    });

    it('should fail with 401 if token is missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send(testVehiclePayload);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with 400 validation error if mandatory fields are missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: '',
          model: '',
          category: 'INVALID_CATEGORY',
          price: -100,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation Error');
      expect(res.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return all vehicles for logged-in users', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should return filtered list matching search parameters', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Toyota&minPrice=3000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(
        res.body.data.every((v) => v.make === 'Toyota' && v.price >= 3000000)
      ).toBe(true);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update and return vehicle attributes successfully', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${sampleVehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 3800000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(3800000);
    });

    it('should throw 404 if vehicle does not exist', async () => {
      const res = await request(app)
        .put('/api/vehicles/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 3800000 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should allow admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${sampleVehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny access (403) for non-admin user role', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${sampleVehicle._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrease quantity by 1 on purchase successfully', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleVehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(4);
    });

    it('should fail with 400 if vehicle inventory is out of stock', async () => {
      await Vehicle.findByIdAndUpdate(sampleVehicle._id, { quantity: 0 });

      const res = await request(app)
        .post(`/api/vehicles/${sampleVehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Vehicle is out of stock');
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow admin to restock and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleVehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(15);
    });

    it('should deny non-admin access (403) to restock route', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleVehicle._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should fail with 400 if validation constraints fail', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${sampleVehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
