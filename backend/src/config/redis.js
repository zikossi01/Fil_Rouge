const redis = require('redis');
const logger = require('../utils/logger');

let client;

const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    await client.connect();
  } catch (error) {
    logger.error('Redis connection failed:', error);
  }
};

const getRedisClient = () => client;

module.exports = {
  connectRedis,
  getRedisClient
};