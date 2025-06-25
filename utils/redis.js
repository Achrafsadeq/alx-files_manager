import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error('Redis Client Error:', err));
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (err) {
      console.error('Redis get error:', err);
      throw err;
    }
  }

  async set(key, value, duration) {
    try {
      await this.setexAsync(key, duration, value);
    } catch (err) {
      console.error('Redis set error:', err);
      throw err;
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error('Redis del error:', err);
      throw err;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
