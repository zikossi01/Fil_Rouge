const express = require('express');
const router = express.Router();
const {
  generateUnlimitedProducts,
  getUnlimitedProducts,
  autoGenerateProducts,
  removeDuplicateProducts,
  clearAndRegenerateProducts
} = require('../controllers/comprehensiveController');

// Generate unlimited products
router.post('/generate', generateUnlimitedProducts);

// Get products with unlimited pagination
router.get('/products', getUnlimitedProducts);

// Auto-generate products endpoint (for manual triggering)
router.post('/auto-generate', async (req, res) => {
  try {
    await autoGenerateProducts();
    res.json({ message: 'Auto-generation completed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove duplicate products endpoint
router.delete('/duplicates', async (req, res) => {
  try {
    const removedCount = await removeDuplicateProducts();
    res.json({ 
      message: 'Duplicate removal completed successfully',
      removedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear all products and regenerate with unique system
router.post('/clear-and-regenerate', async (req, res) => {
  try {
    const generatedCount = await clearAndRegenerateProducts();
    res.json({ 
      message: 'Products cleared and regenerated successfully',
      generatedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
