const vehicleRepository = require('./vehicle.repository');
const NotFoundError = require('../../shared/errors/NotFoundError');
const ValidationError = require('../../shared/errors/ValidationError');

/**
 * Create a new vehicle record.
 * @param {Object} vehicleData - Raw fields for the new vehicle
 * @returns {Promise<Object>} The created vehicle instance
 */
const createVehicle = async (vehicleData) => {
  return vehicleRepository.create(vehicleData);
};

/**
 * Retrieve all vehicles in inventory.
 * @returns {Promise<Array<Object>>} List of all vehicles
 */
const getAllVehicles = async () => {
  return vehicleRepository.findAll();
};

/**
 * Search vehicles matching filters (make, model, category, price bounds).
 * @param {Object} filters - Search filters mapping
 * @returns {Promise<Array<Object>>} List of matching vehicles
 */
const searchVehicles = async (filters) => {
  return vehicleRepository.search(filters);
};

/**
 * Update an existing vehicle's fields.
 * @param {string} id - Vehicle ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} The updated vehicle instance
 * @throws {NotFoundError} If the vehicle does not exist
 */
const updateVehicle = async (id, data) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }
  return vehicleRepository.findByIdAndUpdate(id, data);
};

/**
 * Delete a vehicle by its ID.
 * @param {string} id - Vehicle ID to delete
 * @returns {Promise<Object>} The deleted vehicle instance
 * @throws {NotFoundError} If the vehicle does not exist
 */
const deleteVehicle = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }
  return vehicleRepository.deleteById(id);
};

/**
 * Purchase a vehicle and decrease inventory quantity by 1.
 * @param {string} id - Vehicle ID
 * @returns {Promise<Object>} The updated vehicle instance
 * @throws {NotFoundError} If the vehicle does not exist
 * @throws {ValidationError} If the vehicle is out of stock (quantity <= 0)
 */
const purchaseVehicle = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }
  if (vehicle.quantity <= 0) {
    throw new ValidationError('Vehicle is out of stock');
  }
  return vehicleRepository.findByIdAndUpdate(id, {
    quantity: vehicle.quantity - 1,
  });
};

/**
 * Restock inventory quantity for a vehicle.
 * @param {string} id - Vehicle ID
 * @param {number} quantity - Number of units to add (must be > 0)
 * @returns {Promise<Object>} The updated vehicle instance
 * @throws {ValidationError} If the restock quantity is <= 0
 * @throws {NotFoundError} If the vehicle does not exist
 */
const restockVehicle = async (id, quantity) => {
  if (quantity <= 0) {
    throw new ValidationError('Restock quantity must be greater than zero');
  }
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }
  return vehicleRepository.findByIdAndUpdate(id, {
    quantity: vehicle.quantity + quantity,
  });
};

module.exports = {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
