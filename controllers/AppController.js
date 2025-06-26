import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
    try {
      res.status(200).json({
        users: await dbClient.nbUsers(),
        files: await dbClient.nbFiles(),
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AppController;
