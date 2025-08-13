const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  assignDeliveryPersonnel
} = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(auth);

const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').notEmpty().withMessage('Delivery street is required'),
  body('deliveryAddress.city').notEmpty().withMessage('Delivery city is required'),
  body('deliveryAddress.state').notEmpty().withMessage('Delivery state is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Delivery zip code is required'),
  body('paymentMethod').isIn(['card', 'cash', 'digital_wallet']).withMessage('Invalid payment method')
];

router.post('/', createOrderValidation, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authorize(['admin', 'delivery']), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/assign-delivery', authorize(['admin']), assignDeliveryPersonnel);

module.exports = router;