const express = require('express');
const router = express.Router();
const {
  getPerfectProducts,
  generateUnlimitedPerfectProducts,
  clearAndRegeneratePerfectProducts
} = require('../controllers/perfectController');

// GET /api/perfect/products - Get perfect products with pagination
router.get('/products', getPerfectProducts);

// POST /api/perfect/generate - Generate more perfect products
router.post('/generate', generateUnlimitedPerfectProducts);

// POST /api/perfect/clear-and-regenerate - Clear all products and regenerate with unique system
router.post('/clear-and-regenerate', async (req, res) => {
  try {
    const generatedCount = await clearAndRegeneratePerfectProducts();
    res.json({ 
      message: 'Perfect products cleared and regenerated successfully',
      generatedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

