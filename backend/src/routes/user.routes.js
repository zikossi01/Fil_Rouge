const express = require('express');
const { body } = require('express-validator');
const {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  changePassword
} = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(auth);

const profileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const addressValidation = [
  body('street').notEmpty().withMessage('Street address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required')
];

router.put('/profile', profileValidation, updateProfile);
router.post('/addresses', addressValidation, addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.get('/orders', getUserOrders);
router.put('/change-password', changePassword);

module.exports = router;