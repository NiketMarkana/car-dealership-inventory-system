// Controller Responsibility: Handles incoming HTTP requests, extracts parameters, delegates to vehicleService, and structures the HTTP response utilizing apiResponse helpers.

const vehicleService = require('./vehicle.service');
const {
  sendSuccess,
  sendCreated,
} = require('../../shared/responses/apiResponse');

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    return sendCreated(res, 'Vehicle created successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return sendSuccess(res, 'Vehicles retrieved successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

const searchVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.searchVehicles(req.query);
    return sendSuccess(res, 'Search completed successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return sendSuccess(res, 'Vehicle updated successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(req.params.id);
    return sendSuccess(res, 'Vehicle deleted successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const purchaseVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.purchaseVehicle(req.params.id);
    return sendSuccess(res, 'Vehicle purchased successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const restockVehicle = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const vehicle = await vehicleService.restockVehicle(
      req.params.id,
      quantity
    );
    return sendSuccess(res, 'Vehicle restocked successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
