const mongoose = require('mongoose');
const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jeuController = require('../controllers/jeuController');

let mongoServer;
let app;
let api;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.get('/jeux', jeuController.obtenirJeux);
  app.post('/jeux', jeuController.creerJeu);
  app.get('/jeux/:id', jeuController.obtenirJeuParId);
  app.put('/jeux/:id', jeuController.mettreAJourJeu);
  app.delete('/jeux/:id', jeuController.supprimerJeu);
  app.delete('/jeux/:id/joueurs/:playerId', jeuController.retirerJoueur);
  app.post('/jeux/:id/personnages', jeuController.ajouterPersonnage);

  api = supertest(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Jeu Controller Integration Tests', () => {
  it('should create a new jeu', async () => {
    const response = await api
      .post('/jeux')
      .send({ nom: 'Test Jeu', description: 'Un jeu de test' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nom).toBe('Test Jeu');
  });

  it('should get all jeux', async () => {
    const response = await api.get('/jeux');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should get a jeu by ID', async () => {
    const createResponse = await api
      .post('/jeux')
      .send({ nom: 'Get By ID Jeu', description: 'Jeu à récupérer par ID' });
    
    const jeuId = createResponse.body._id;

    const response = await api.get(`/jeux/${jeuId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', jeuId);
    expect(response.body.nom).toBe('Get By ID Jeu');
  });

  it('should update a jeu', async () => {
    const createResponse = await api
      .post('/jeux')
      .send({ nom: 'Update Jeu', description: 'Jeu à mettre à jour' });
    
    const jeuId = createResponse.body._id;

    const response = await api
      .put(`/jeux/${jeuId}`)
      .send({ nom: 'Updated Jeu', description: 'Jeu mis à jour' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', jeuId);
    expect(response.body.nom).toBe('Updated Jeu');
    expect(response.body.description).toBe('Jeu mis à jour');
  });

  it('should delete a jeu', async () => {
    const createResponse = await api
      .post('/jeux')
      .send({ nom: 'Delete Jeu', description: 'Jeu à supprimer' });
    
    const jeuId = createResponse.body._id;

    const deleteResponse = await api.delete(`/jeux/${jeuId}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', "Jeu supprimé avec succès");

    const getResponse = await api.get(`/jeux/${jeuId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should remove a player from a jeu', async () => {
    const createResponse = await api
      .post('/jeux')
      .send({ nom: 'Remove Player Jeu', description: 'Jeu pour retirer un joueur' });
    
    const jeuId = createResponse.body._id;
    const playerId = 'somePlayerId'; // Vous devrez peut-être créer un joueur réel ici

    const response = await api.delete(`/jeux/${jeuId}/joueurs/${playerId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', jeuId);
    // Ajoutez d'autres assertions selon la logique de votre application
  });

  it('should add a character to a jeu', async () => {
    const createResponse = await api
      .post('/jeux')
      .send({ nom: 'Add Character Jeu', description: 'Jeu pour ajouter un personnage' });
    
    const jeuId = createResponse.body._id;
    const personnageId = 'someCharacterId'; // Vous devrez peut-être créer un personnage réel ici

    const response = await api
      .post(`/jeux/${jeuId}/personnages`)
      .send({ personnageId });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', jeuId);
    // Ajoutez d'autres assertions selon la logique de votre application
  });
});
