// routes/userRoutes.js
const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  getUserStats,
  getDeliveryPersons
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.get('/stats', protect, admin, getUserStats);
router.get('/delivery-persons', protect, admin, getDeliveryPersons);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);

module.exports = router;