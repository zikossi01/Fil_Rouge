const { body, param, query } = require('express-validator');

const validators = {
  // User validation
  validateUserRegistration: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('role').optional().isIn(['customer', 'delivery']).withMessage('Invalid role')
  ],

  validateUserLogin: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],

  // Product validation
  validateProduct: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Product description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
    body('unit').isIn(['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'pack']).withMessage('Invalid unit')
  ],

  // Order validation
  validateOrder: [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.product').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
    body('deliveryAddress.city').notEmpty().withMessage('City is required'),
    body('deliveryAddress.state').notEmpty().withMessage('State is required'),
    body('deliveryAddress.zipCode').notEmpty().withMessage('ZIP code is required'),
    body('paymentMethod').isIn(['card', 'cash', 'digital_wallet']).withMessage('Invalid payment method')
  ],

  // Pagination validation
  validatePagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],

  // MongoDB ID validation
  validateMongoId: [
    param('id').isMongoId().withMessage('Invalid ID format')
  ]
};

module.exports = validators;