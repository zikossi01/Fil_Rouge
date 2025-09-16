const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { seedProducts, seedMoreProducts, seedAdmin, bulkGenerateProducts } = require('../controllers/seedController');

const router = express.Router();

router.post('/products', protect, admin, seedProducts);
router.post('/products/more', protect, admin, seedMoreProducts);
router.post('/admin', seedAdmin);
router.post('/bulk', protect, admin, bulkGenerateProducts);

module.exports = router;


