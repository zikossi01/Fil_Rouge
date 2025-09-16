const express = require('express');
const {
  assignDelivery,
  getDeliveryPersonOrders,
  updateDeliveryStatus,
  getAllDeliveries,
  listAvailableOrders,
  claimOrder
} = require('../controllers/deliveryController');
const { protect, admin, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/assign', protect, admin, assignDelivery);
router.get('/my-deliveries', protect, authorizeRoles('delivery'), getDeliveryPersonOrders);
router.get('/available', protect, authorizeRoles('delivery','admin'), listAvailableOrders);
router.post('/claim/:orderId', protect, authorizeRoles('delivery'), claimOrder);
router.put('/:id/status', protect, authorizeRoles('delivery','admin'), updateDeliveryStatus);
router.get('/all', protect, admin, getAllDeliveries);

module.exports = router;