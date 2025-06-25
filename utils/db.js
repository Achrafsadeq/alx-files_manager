import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'development';
    const url = `mongodb://${host}:${port}/${database}`;
    
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = null;
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log('MongoDB connected');
      })
      .catch((err) => console.error('MongoDB Client Error:', err));
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.isAlive()) return 0;
    return await this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) return 0;
    return await this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
