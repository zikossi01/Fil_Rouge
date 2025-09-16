const express = require('express');
const { getCuratedProducts, seedCuratedProducts, generateProducts } = require('../controllers/curatedController');
// Public seeding per requirement; no auth middleware

const router = express.Router();

router.get('/', getCuratedProducts);
router.post('/seed', seedCuratedProducts);
router.post('/generate', generateProducts);

module.exports = router;


