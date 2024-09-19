const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Assurez-vous d'avoir un modèle User
const personnageController = require('./src/controllers/personnageController');
const joueurController = require('./src/controllers/joueurController');
const jeuController = require('./src/controllers/jeuController');
const saisonController = require('./src/controllers/saisonController');
const authRoutes = require('./src/routes/authRoutes');
const seedUsers = require('./src/utils/seedDatas/seedUsers');
const seedJeux = require('./src/utils/seedDatas/seedJeux');
const seedSaisons = require('./src/utils/seedDatas/seedSaison');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connecté à la base de données');
  seedJeux();
  seedSaisons();
   // Appel de la fonction seedJeux après la connexion
  return seedUsers(); // Appel de la fonction seedUsers après la connexion

})
.then(() => {
  console.log('Utilisateurs de test créés ou vérifiés');
})
.catch((err) => console.error('Erreur de connexion ou de seeding :', err));

app.use(cors());
app.use(express.json());

// Routes pour les personnages
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

// Supposons que nous avons un ensemble pour stocker les tokens invalidés
const invalidatedTokens = new Set();

// Ajoutez cette fonction de middleware pour vérifier le token
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

// Modifiez la route de login pour utiliser une clé secrète depuis les variables d'environnement
// et augmenter la durée de validité du token
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

// Ajoutez une route pour vérifier le token
app.get('/verify-token', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Ajouter le token à la liste des tokens invalidés
    invalidatedTokens.add(token);
    
    // Optionnel : Vous pouvez également essayer de décoder le token pour obtenir des informations supplémentaires
    try {
      const decoded = jwt.verify(token, 'votre_secret_jwt');
      console.log(`Utilisateur ${decoded.id} déconnecté`);
    } catch (error) {
      console.log('Token invalide ou expiré');
    }
  }

  res.json({ message: "Déconnexion réussie" });
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API Express !');
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});