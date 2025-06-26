const { expect } = require('chai');
const request = require('request');

describe('Users Controller', () => {
  const API_URL = 'http://localhost:5000';
  let authToken = '';

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      request.post({
        url: `${API_URL}/users`,
        json: userData
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(201);
        expect(body).to.have.property('id');
        expect(body).to.have.property('email', userData.email);
        done();
      });
    });

    it('should return error for missing email', (done) => {
      request.post({
        url: `${API_URL}/users`,
        json: { password: 'password123' }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body).to.have.property('error', 'Missing email');
        done();
      });
    });

    it('should return error for missing password', (done) => {
      request.post({
        url: `${API_URL}/users`,
        json: { email: 'test@example.com' }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body).to.have.property('error', 'Missing password');
        done();
      });
    });

    it('should return error for existing email', (done) => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      request.post({
        url: `${API_URL}/users`,
        json: userData
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body).to.have.property('error', 'Already exist');
        done();
      });
    });
  });

  describe('GET /users/me', () => {
    before((done) => {
      // Authenticate to get token
      const auth = {
        email: 'test@example.com',
        password: 'password123'
      };
      const authHeader = `Basic ${Buffer.from(`${auth.email}:${auth.password}`).toString('base64')}`;

      request.get({
        url: `${API_URL}/connect`,
        headers: { Authorization: authHeader }
      }, (err, res, body) => {
        authToken = JSON.parse(body).token;
        done();
      });
    });

    it('should return current user', (done) => {
      request.get({
        url: `${API_URL}/users/me`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        const response = JSON.parse(body);
        expect(response).to.have.property('id');
        expect(response).to.have.property('email', 'test@example.com');
        done();
      });
    });

    it('should return error for invalid token', (done) => {
      request.get({
        url: `${API_URL}/users/me`,
        headers: { 'X-Token': 'invalid-token' }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(401);
        expect(JSON.parse(body)).to.have.property('error', 'Unauthorized');
        done();
      });
    });
  });
});
