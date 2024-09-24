import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectToMongoDBAndSeed } from './src/utils/database.js';
import personnageRoute from './src/routes/personnageRoute.js';
import joueurRoute from './src/routes/joueurRoute.js';
import jeuRoute from './src/routes/jeuxRoute.js';
import saisonRoute from './src/routes/saisonRoute.js';
import authRoute from './src/routes/authRoute.js';
import classeRoute from './src/routes/classRoute.js';
import { corsOptions, setupCORS } from './src/config/corsConfig.js';
import { verifyToken } from './src/middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const MONGODB_URI = isProduction ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions));

// Routes
app.use('/personnages', personnageRoute);
app.use('/joueurs', joueurRoute);
app.use('/jeux', jeuRoute);
app.use('/saisons', saisonRoute);
app.use('/auth', authRoute);
app.use('/classes', classeRoute);
// Token verification route
app.get('/verify-token', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Root route
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API Express !');
});

// Setup CORS for OPTIONS requests
setupCORS(app);

// Connect to MongoDB and start server
connectToMongoDBAndSeed(MONGODB_URI, isProduction).then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Erreur lors du démarrage du serveur:', err);
  process.exit(1);
});

export default app;