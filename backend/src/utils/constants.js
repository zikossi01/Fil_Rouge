module.exports = {
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY_FOR_PICKUP: 'ready_for_pickup',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  DELIVERY_STATUS: {
    ASSIGNED: 'assigned',
    PICKUP_IN_PROGRESS: 'pickup_in_progress',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    ARRIVED: 'arrived',
    DELIVERED: 'delivered',
    FAILED: 'failed'
  },

  USER_ROLES: {
    CUSTOMER: 'customer',
    DELIVERY: 'delivery',
    ADMIN: 'admin'
  },

  PRODUCT_UNITS: {
    KG: 'kg',
    GRAM: 'g',
    LITER: 'l',
    ML: 'ml',
    PIECE: 'piece',
    DOZEN: 'dozen',
    PACK: 'pack'
  },

  PAYMENT_METHODS: {
    CARD: 'card',
    CASH: 'cash',
    DIGITAL_WALLET: 'digital_wallet'
  },

  ADDRESS_TYPES: {
    HOME: 'home',
    WORK: 'work',
    OTHER: 'other'
  },

  VEHICLE_TYPES: {
    BIKE: 'bike',
    CAR: 'car',
    MOTORCYCLE: 'motorcycle',
    WALKING: 'walking'
  }
};

// eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};

// nodemon.json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/tests/**/*.js"],
  "env": {
    "NODE_ENV": "development"
  },
  "exec": "node src/server.js"
}// package.json
{
  "name": "grocery-delivery-backend",
  "version": "1.0.0",
  "description": "Backend API for grocery delivery application",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.40.0",
    "stripe": "^13.3.0",
    "nodemailer": "^6.9.4",
    "socket.io": "^4.7.2",
    "redis": "^4.6.8",
    "winston": "^3.10.0",
    "bull": "^4.11.3",
    "axios": "^1.5.0",
    "moment": "^2.29.4",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4",
    "express-mongo-sanitize": "^2.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "eslint": "^8.47.0"
  }
}