// Route Responsibility: Maps REST endpoints to validation rules and controller actions, enforcing JWT authentication and admin role authorization checks.

const express = require('express');
const router = express.Router();
const vehicleController = require('./vehicle.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const {
  validateCreateVehicle,
  validateUpdateVehicle,
  validateRestockVehicle,
} = require('./vehicle.validation');

router.use(protect);

router.post('/', validateCreateVehicle, vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/search', vehicleController.searchVehicles);
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);
router.delete('/:id', authorize('ADMIN'), vehicleController.deleteVehicle);

router.post('/:id/purchase', vehicleController.purchaseVehicle);
router.post(
  '/:id/restock',
  authorize('ADMIN'),
  validateRestockVehicle,
  vehicleController.restockVehicle
);

module.exports = router;
