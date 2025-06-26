const { expect } = require('chai');
const dbClient = require('../utils/db');

describe('dbClient', () => {
  it('should be alive when connection is successful', () => {
    expect(dbClient.isAlive()).to.be.true;
  });

  it('should return correct number of users', async () => {
    const usersCount = await dbClient.nbUsers();
    expect(usersCount).to.be.a('number');
  });

  it('should return correct number of files', async () => {
    const filesCount = await dbClient.nbFiles();
    expect(filesCount).to.be.a('number');
  });
});
