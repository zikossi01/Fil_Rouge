const express = require('express');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  addProductReview,
  getCategories
} = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/:id/reviews', auth, addProductReview);

module.exports = router;