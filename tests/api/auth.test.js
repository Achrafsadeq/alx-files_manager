const { expect } = require('chai');
const request = require('request');

describe('Auth Controller', () => {
  const API_URL = 'http://localhost:5000';
  let authToken = '';

  before((done) => {
    // Create a user first
    const userData = {
      email: 'auth@test.com',
      password: 'password123'
    };

    request.post({
      url: `${API_URL}/users`,
      json: userData
    }, () => {
      done();
    });
  });

  describe('GET /connect', () => {
    it('should authenticate user and return token', (done) => {
      const auth = {
        email: 'auth@test.com',
        password: 'password123'
      };
      const authHeader = `Basic ${Buffer.from(`${auth.email}:${auth.password}`).toString('base64')}`;

      request.get({
        url: `${API_URL}/connect`,
        headers: { Authorization: authHeader }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        const response = JSON.parse(body);
        expect(response).to.have.property('token');
        authToken = response.token;
        done();
      });
    });

    it('should return error for invalid credentials', (done) => {
      const authHeader = `Basic ${Buffer.from('invalid:credentials').toString('base64')}`;

      request.get({
        url: `${API_URL}/connect`,
        headers: { Authorization: authHeader }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(401);
        expect(JSON.parse(body)).to.have.property('error', 'Unauthorized');
        done();
      });
    });
  });

  describe('GET /disconnect', () => {
    it('should sign out user', (done) => {
      request.get({
        url: `${API_URL}/disconnect`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(204);
        expect(body).to.be.empty;
        done();
      });
    });

    it('should return error for invalid token', (done) => {
      request.get({
        url: `${API_URL}/disconnect`,
        headers: { 'X-Token': 'invalid-token' }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(401);
        expect(JSON.parse(body)).to.have.property('error', 'Unauthorized');
        done();
      });
    });
  });
});
