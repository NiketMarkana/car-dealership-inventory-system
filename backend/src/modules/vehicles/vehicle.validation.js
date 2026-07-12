// Validation Purpose: Verifies body parameters using express-validator constraints to ensure type safety and correctness before requests propagate to the controller.

const { body, validationResult } = require('express-validator');
const ValidationError = require('../../shared/errors/ValidationError');

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ValidationError('Validation Error', formattedErrors));
  }
  next();
};

const validateCreateVehicle = [
  body('make').notEmpty().withMessage('Make is required').trim(),
  body('model').notEmpty().withMessage('Model is required').trim(),
  body('category').notEmpty().withMessage('Category is required').trim(),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  runValidation,
];

const validateUpdateVehicle = [
  body('make').optional().notEmpty().withMessage('Make cannot be empty').trim(),
  body('model')
    .optional()
    .notEmpty()
    .withMessage('Model cannot be empty')
    .trim(),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .trim(),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  runValidation,
];

const validateRestockVehicle = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer'),
  runValidation,
];

module.exports = {
  validateCreateVehicle,
  validateUpdateVehicle,
  validateRestockVehicle,
};
