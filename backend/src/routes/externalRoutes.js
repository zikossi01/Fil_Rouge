const express = require('express');
const { searchLiveProducts } = require('../controllers/externalController');

const router = express.Router();

router.get('/search', searchLiveProducts);

module.exports = router;






