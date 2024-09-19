const mongoose = require('mongoose');
const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const joueurController = require('../controllers/joueurController');

let mongoServer;
let app;
let api;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.get('/joueurs', joueurController.obtenirJoueurs);
  app.post('/joueurs', joueurController.creerJoueur);
  app.get('/joueurs/:id', joueurController.obtenirJoueurParId);
  app.put('/joueurs/:id', joueurController.mettreAJourJoueur);
  app.delete('/joueurs/:id', joueurController.supprimerJoueur);

  api = supertest(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Joueur Controller Integration Tests', () => {
  it('should create a new joueur', async () => {
    const response = await api
      .post('/joueurs')
      .send({ nom: 'Test Joueur', email: 'test@example.com' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nom).toBe('Test Joueur');
  });

  it('should get all joueurs', async () => {
    const response = await api.get('/joueurs');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
  it('should get a joueur by ID', async () => {
    // First, create a joueur to get its ID
    const createResponse = await api
      .post('/joueurs')
      .send({ nom: 'Get By ID Joueur', email: 'getbyid@example.com' });
    
    const joueurId = createResponse.body._id;

    const response = await api.get(`/joueurs/${joueurId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', joueurId);
    expect(response.body.nom).toBe('Get By ID Joueur');
  });

  it('should update a joueur', async () => {
    // First, create a joueur to update
    const createResponse = await api
      .post('/joueurs')
      .send({ nom: 'Update Joueur', email: 'update@example.com' });
    
    const joueurId = createResponse.body._id;

    const response = await api
      .put(`/joueurs/${joueurId}`)
      .send({ nom: 'Updated Joueur', email: 'updated@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', joueurId);
    expect(response.body.nom).toBe('Updated Joueur');
    expect(response.body.email).toBe('updated@example.com');
  });

  it('should delete a joueur', async () => {
    // First, create a joueur to delete
    const createResponse = await api
      .post('/joueurs')
      .send({ nom: 'Delete Joueur', email: 'delete@example.com' });
    
    const joueurId = createResponse.body._id;

    const deleteResponse = await api.delete(`/joueurs/${joueurId}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', "Joueur supprimé avec succès");

    // Verify the joueur is actually deleted
    const getResponse = await api.get(`/joueurs/${joueurId}`);
    expect(getResponse.status).toBe(404);
  });

  // Add more tests for other routes (GET by ID, PUT, DELETE) here
});
