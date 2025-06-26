const { expect } = require('chai');
const request = require('request');

describe('Stats Controller', () => {
  const API_URL = 'http://localhost:5000';

  it('GET /stats should return users and files count', (done) => {
    request.get(`${API_URL}/stats`, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      const response = JSON.parse(body);
      expect(response).to.have.property('users');
      expect(response).to.have.property('files');
      expect(response.users).to.be.a('number');
      expect(response.files).to.be.a('number');
      done();
    });
  });
});
