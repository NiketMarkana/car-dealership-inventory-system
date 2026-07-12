const vehicleService = require('../../../src/modules/vehicles/vehicle.service');
const vehicleRepository = require('../../../src/modules/vehicles/vehicle.repository');
const NotFoundError = require('../../../src/shared/errors/NotFoundError');
const ValidationError = require('../../../src/shared/errors/ValidationError');

jest.mock('../../../src/modules/vehicles/vehicle.repository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteById: jest.fn(),
  search: jest.fn(),
}));

describe('Vehicle Service', () => {
  const mockVehicle = {
    id: 'vehicle-id-123',
    make: 'Toyota',
    model: 'Fortuner',
    category: 'SUV',
    price: 3500000,
    quantity: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('should create a vehicle and return it', async () => {
      vehicleRepository.create.mockResolvedValue(mockVehicle);

      const result = await vehicleService.createVehicle(mockVehicle);

      expect(vehicleRepository.create).toHaveBeenCalledWith(mockVehicle);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles', async () => {
      vehicleRepository.findAll.mockResolvedValue([mockVehicle]);

      const result = await vehicleService.getAllVehicles();

      expect(vehicleRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('searchVehicles', () => {
    it('should search vehicles with filters', async () => {
      const filters = { make: 'Toyota' };
      vehicleRepository.search.mockResolvedValue([mockVehicle]);

      const result = await vehicleService.searchVehicles(filters);

      expect(vehicleRepository.search).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('updateVehicle', () => {
    it('should update and return vehicle if it exists', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.findByIdAndUpdate.mockResolvedValue({
        ...mockVehicle,
        price: 3600000,
      });

      const result = await vehicleService.updateVehicle(mockVehicle.id, {
        price: 3600000,
      });

      expect(vehicleRepository.findById).toHaveBeenCalledWith(mockVehicle.id);
      expect(vehicleRepository.findByIdAndUpdate).toHaveBeenCalledWith(
        mockVehicle.id,
        {
          price: 3600000,
        }
      );
      expect(result.price).toBe(3600000);
    });

    it('should throw NotFoundError if vehicle to update does not exist', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(
        vehicleService.updateVehicle('invalid-id', { price: 3600000 })
      ).rejects.toThrow(NotFoundError);
      expect(vehicleRepository.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle if it exists', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.deleteById.mockResolvedValue(mockVehicle);

      const result = await vehicleService.deleteVehicle(mockVehicle.id);

      expect(vehicleRepository.findById).toHaveBeenCalledWith(mockVehicle.id);
      expect(vehicleRepository.deleteById).toHaveBeenCalledWith(mockVehicle.id);
      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundError if vehicle to delete does not exist', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.deleteVehicle('invalid-id')).rejects.toThrow(
        NotFoundError
      );
      expect(vehicleRepository.deleteById).not.toHaveBeenCalled();
    });
  });

  describe('purchaseVehicle', () => {
    it('should decrease quantity by 1 and save if stock exists', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.findByIdAndUpdate.mockResolvedValue({
        ...mockVehicle,
        quantity: 4,
      });

      const result = await vehicleService.purchaseVehicle(mockVehicle.id);

      expect(vehicleRepository.findById).toHaveBeenCalledWith(mockVehicle.id);
      expect(vehicleRepository.findByIdAndUpdate).toHaveBeenCalledWith(
        mockVehicle.id,
        {
          quantity: 4,
        }
      );
      expect(result.quantity).toBe(4);
    });

    it('should throw NotFoundError if vehicle does not exist', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(
        vehicleService.purchaseVehicle('invalid-id')
      ).rejects.toThrow(NotFoundError);
      expect(vehicleRepository.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if stock is 0', async () => {
      vehicleRepository.findById.mockResolvedValue({
        ...mockVehicle,
        quantity: 0,
      });

      await expect(
        vehicleService.purchaseVehicle(mockVehicle.id)
      ).rejects.toThrow(ValidationError);
      expect(vehicleRepository.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('restockVehicle', () => {
    it('should increase quantity and return vehicle if details are valid', async () => {
      vehicleRepository.findById.mockResolvedValue(mockVehicle);
      vehicleRepository.findByIdAndUpdate.mockResolvedValue({
        ...mockVehicle,
        quantity: 10,
      });

      const result = await vehicleService.restockVehicle(mockVehicle.id, 5);

      expect(vehicleRepository.findById).toHaveBeenCalledWith(mockVehicle.id);
      expect(vehicleRepository.findByIdAndUpdate).toHaveBeenCalledWith(
        mockVehicle.id,
        {
          quantity: 10,
        }
      );
      expect(result.quantity).toBe(10);
    });

    it('should throw ValidationError if restock quantity is not positive', async () => {
      await expect(
        vehicleService.restockVehicle(mockVehicle.id, 0)
      ).rejects.toThrow(ValidationError);
      await expect(
        vehicleService.restockVehicle(mockVehicle.id, -5)
      ).rejects.toThrow(ValidationError);
      expect(vehicleRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if vehicle does not exist', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(
        vehicleService.restockVehicle('invalid-id', 5)
      ).rejects.toThrow(NotFoundError);
      expect(vehicleRepository.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });
});
