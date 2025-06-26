const { expect } = require('chai');
const redisClient = require('../utils/redis');

describe('redisClient', () => {
  it('should be alive when connection is successful', () => {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should set and get value correctly', async () => {
    await redisClient.set('testKey', 'testValue', 10);
    const value = await redisClient.get('testKey');
    expect(value).to.equal('testValue');
  });

  it('should delete key correctly', async () => {
    await redisClient.set('testKey', 'testValue', 10);
    await redisClient.del('testKey');
    const value = await redisClient.get('testKey');
    expect(value).to.be.null;
  });

  it('should expire key after TTL', async function() {
    this.timeout(5000);
    await redisClient.set('testKey', 'testValue', 1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const value = await redisClient.get('testKey');
    expect(value).to.be.null;
  });
});
