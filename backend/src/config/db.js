const mongoose = require('mongoose');
let MongoMemoryServer;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      bufferCommands: false // Disable mongoose buffering
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);

    // Fallback to in-memory MongoDB only in development/test
    const nodeEnv = process.env.NODE_ENV || 'development';
    const allowMemory = nodeEnv !== 'production';

    if (!allowMemory) {
      process.exit(1);
    }

    try {
      // Lazy require to avoid mandatory dependency in production
      ({ MongoMemoryServer } = require('mongodb-memory-server'));
    } catch (e) {
      console.error('mongodb-memory-server is not installed. Install it to use in-memory DB.');
      process.exit(1);
    }

    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false
      });
      console.log('Connected to in-memory MongoDB instance');
      return conn;
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;