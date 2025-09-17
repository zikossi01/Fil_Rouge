// server.js (updated)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { seedCuratedProducts, ensureMinimumProducts } = require('./controllers/curatedController');
const Product = require('./models/Product');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes'); 
const seedRoutes = require('./routes/seedRoutes'); 
const curatedRoutes = require('./routes/curatedRoutes');
const comprehensiveRoutes = require('./routes/comprehensiveRoutes');


dotenv.config();


connectDB().then(async () => {
  try {
    const { autoGenerateProducts } = require('./controllers/comprehensiveController');
    await autoGenerateProducts();
    logger.info('Auto-seeded comprehensive products on startup.');
  } catch (e) {
    logger.error(`Auto-seed failed: ${e.message}`);
  }
});

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/upload', uploadRoutes); 
app.use('/api/seed', seedRoutes); 
app.use('/api/curated', curatedRoutes);
app.use('/api/comprehensive', comprehensiveRoutes);
app.use('/api/perfect', require('./routes/perfectRoutes'));


app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Grocery Delivery API is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;