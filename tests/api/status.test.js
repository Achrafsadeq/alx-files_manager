const { expect } = require('chai');
const request = require('request');

describe('Status Controller', () => {
  const API_URL = 'http://localhost:5000';

  it('GET /status should return redis and db status', (done) => {
    request.get(`${API_URL}/status`, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      const response = JSON.parse(body);
      expect(response).to.deep.equal({
        redis: true,
        db: true
      });
      done();
    });
  });
});
