import Redis from 'ioredis';
import config from './config.js';

const redisConnection = new Redis({ host: config.REDIS_HOST, port: config.REDIS_PORT });

export default redisConnection;
