import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import personnageController from './src/controllers/personnageController.js';
import joueurController from './src/controllers/joueurController.js';
import jeuController from './src/controllers/jeuController.js';
import saisonController from './src/controllers/saisonController.js';
import authRoutes from './src/routes/authRoutes.js';
import seedUsers from './src/utils/seedDatas/seedUsers.js';
import seedJeux from './src/utils/seedDatas/seedJeux.js';
import seedSaisons from './src/utils/seedDatas/seedSaison.js';
import dotenv from 'dotenv';

dotenv.config(); 

const isProduction = process.env.NODE_ENV === 'production';
const MONGODB_URI = isProduction ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;

const app = express();
const PORT = process.env.PORT || 5000;

// Remove or comment out this block
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
// });

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Ajoutez ceci pour gérer explicitement les requêtes OPTIONS
app.options('*', cors(corsOptions));

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`Connecté à MongoDB ${isProduction ? 'Atlas' : 'local'}`);
  if (!isProduction) {
    return Promise.all([seedJeux(), seedSaisons(), seedUsers()]);
  }
})
.then(() => {
  if (!isProduction) {
    console.log('Données de test créées ou vérifiées');
  }
})
.catch((err) => console.error('Erreur de connexion ou de seeding :', err));

// Routes
app.use('/auth', authRoutes);
app.post('/personnages', personnageController.creerPersonnage);
app.get('/personnages', personnageController.obtenirPersonnages);
app.get('/personnages/:id', personnageController.obtenirPersonnageParId);
app.put('/personnages/:id', personnageController.mettreAJourPersonnage);
app.delete('/personnages/:id', personnageController.supprimerPersonnage);
app.get('/joueurs', joueurController.obtenirJoueurs);
app.post('/joueurs', joueurController.creerJoueur);
app.get('/joueurs/:id', joueurController.obtenirJoueurParId);
app.put('/joueurs/:id', joueurController.mettreAJourJoueur);
app.delete('/joueurs/:id', joueurController.supprimerJoueur); 
app.post('/jeux', jeuController.creerJeu);
app.get('/jeux', jeuController.obtenirJeux);
app.get('/jeux/:id', jeuController.obtenirJeuParId);
app.put('/jeux/:id', jeuController.mettreAJourJeu);
app.patch('/jeux/:id/addPersonnage', jeuController.ajouterPersonnage);
app.delete('/jeux/:id/removePersonnage/:personnageId', jeuController.retirerPersonnage);
app.delete('/jeux/:id/removePlayer/:playerId', jeuController.retirerJoueur);
app.delete('/jeux/:id', jeuController.supprimerJeu);
app.post('/saisons', saisonController.creerSaison);
app.get('/saisons', saisonController.obtenirSaisons);
app.get('/saisons/:id', saisonController.obtenirSaisonParId);
app.put('/saisons/:id', saisonController.mettreAJourSaison);
app.delete('/saisons/:id', saisonController.supprimerSaison);

// Gestion des tokens invalidés
const invalidatedTokens = new Set();

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: "Un token est requis pour l'authentification" });
  }
  try {
    if (invalidatedTokens.has(token)) {
      return res.status(401).json({ message: "Token invalide" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
  return next();
};

// Route de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route de vérification du token
app.get('/verify-token', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Route de déconnexion
app.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    invalidatedTokens.add(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Utilisateur ${decoded.id} déconnecté`);
    } catch (error) {
      console.log('Token invalide ou expiré');
    }
  }

  res.json({ message: "Déconnexion réussie" });
});

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API Express !');
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Ajoutez ceci pour gérer explicitement les requêtes OPTIONS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

export default app;