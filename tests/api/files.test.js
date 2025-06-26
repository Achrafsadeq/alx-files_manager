const { expect } = require('chai');
const request = require('request');
const fs = require('fs');
const path = require('path');

describe('Files Controller', () => {
  const API_URL = 'http://localhost:5000';
  let authToken = '';
  let fileId = '';
  let folderId = '';

  before((done) => {
    // Authenticate first
    const auth = {
      email: 'files@test.com',
      password: 'password123'
    };
    
    // Create user if not exists
    request.post({
      url: `${API_URL}/users`,
      json: auth
    }, () => {
      const authHeader = `Basic ${Buffer.from(`${auth.email}:${auth.password}`).toString('base64')}`;
      
      request.get({
        url: `${API_URL}/connect`,
        headers: { Authorization: authHeader }
      }, (err, res, body) => {
        authToken = JSON.parse(body).token;
        done();
      });
    });
  });

  describe('POST /files', () => {
    it('should create a new folder', (done) => {
      const folderData = {
        name: 'testFolder',
        type: 'folder'
      };

      request.post({
        url: `${API_URL}/files`,
        headers: { 'X-Token': authToken },
        json: folderData
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(201);
        expect(body).to.have.property('id');
        expect(body).to.have.property('name', folderData.name);
        expect(body).to.have.property('type', folderData.type);
        folderId = body.id;
        done();
      });
    });

    it('should upload a file', (done) => {
      const fileData = {
        name: 'testFile.txt',
        type: 'file',
        data: Buffer.from('Hello World').toString('base64'),
        parentId: folderId
      };

      request.post({
        url: `${API_URL}/files`,
        headers: { 'X-Token': authToken },
        json: fileData
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(201);
        expect(body).to.have.property('id');
        expect(body).to.have.property('name', fileData.name);
        expect(body).to.have.property('type', fileData.type);
        expect(body).to.have.property('parentId', fileData.parentId);
        fileId = body.id;
        done();
      });
    });

    it('should return error for missing name', (done) => {
      request.post({
        url: `${API_URL}/files`,
        headers: { 'X-Token': authToken },
        json: { type: 'file', data: 'data' }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(400);
        expect(body).to.have.property('error', 'Missing name');
        done();
      });
    });
  });

  describe('GET /files/:id', () => {
    it('should retrieve file document', (done) => {
      request.get({
        url: `${API_URL}/files/${fileId}`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        const response = JSON.parse(body);
        expect(response).to.have.property('id', fileId);
        done();
      });
    });

    it('should return error for non-existent file', (done) => {
      request.get({
        url: `${API_URL}/files/nonexistent`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(404);
        expect(JSON.parse(body)).to.have.property('error', 'Not found');
        done();
      });
    });
  });

  describe('GET /files', () => {
    it('should list files with pagination', (done) => {
      request.get({
        url: `${API_URL}/files?parentId=${folderId}&page=0`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        const response = JSON.parse(body);
        expect(response).to.be.an('array');
        expect(response.length).to.be.at.most(20);
        done();
      });
    });
  });

  describe('PUT /files/:id/publish and /unpublish', () => {
    it('should publish and unpublish file', (done) => {
      request.put({
        url: `${API_URL}/files/${fileId}/publish`,
        headers: { 'X-Token': authToken }
      }, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        let response = JSON.parse(body);
        expect(response).to.have.property('isPublic', true);

        request.put({
          url: `${API_URL}/files/${fileId}/unpublish`,
          headers: { 'X-Token': authToken }
        }, (err, res, body) => {
          expect(res.statusCode).to.equal(200);
          response = JSON.parse(body);
          expect(response).to.have.property('isPublic', false);
          done();
        });
      });
    });
  });

  describe('GET /files/:id/data', () => {
    it('should return file content', (done) => {
      // First publish the file
      request.put({
        url: `${API_URL}/files/${fileId}/publish`,
        headers: { 'X-Token': authToken }
      }, () => {
        request.get({
          url: `${API_URL}/files/${fileId}/data`
        }, (err, res, body) => {
          expect(res.statusCode).to.equal(200);
          expect(body).to.equal('Hello World');
          done();
        });
      });
    });
  });
});
