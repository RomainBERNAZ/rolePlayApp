const JoueurService = require('../service/joueurService');
const handleError = require('../utils/errorHandler');

// Fonction pour créer un joueur
exports.creerJoueur = async (req, res) => {
  try {
    const nouveauJoueur = await JoueurService.creerJoueur(req.body);
    res.status(201).json(nouveauJoueur);
  } catch (error) {
    handleError(res, error);
  }
};

// Fonction pour récupérer tous les joueurs
exports.obtenirJoueurs = async (req, res) => {
  try {
    const joueurs = await JoueurService.obtenirJoueurs();
    res.json(joueurs);
  } catch (error) {
    handleError(res, error);
  }
};

// Fonction pour récupérer un joueur par son ID
exports.obtenirJoueurParId = async (req, res) => {
  try {
    const joueur = await JoueurService.obtenirJoueurParId(req.params.id);
    if (joueur) {
      res.json(joueur);
    } else {
      res.status(404).json({ message: "Joueur non trouvé" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Fonction pour mettre à jour un joueur
exports.mettreAJourJoueur = async (req, res) => {
  try {
    const joueur = await JoueurService.mettreAJourJoueur(req.params.id, req.body);
    if (joueur) {
      res.json(joueur);
    } else {
      res.status(404).json({ message: "Joueur non trouvé" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Fonction pour supprimer un joueur
exports.supprimerJoueur = async (req, res) => {
  try {
    const resultat = await JoueurService.supprimerJoueur(req.params.id);
    if (resultat) {
      res.json({ message: "Joueur supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Joueur non trouvé" });
    }
  } catch (error) {
    handleError(res, error);
  }
};