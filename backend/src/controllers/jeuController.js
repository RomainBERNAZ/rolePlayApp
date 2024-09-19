const handleError = require('../utils/errorHandler');
const JeuService = require('../service/jeuService');

exports.creerJeu = async (req, res) => {
  try {
    const nouveauJeu = await JeuService.creerJeu(req.body);
    res.status(201).json(nouveauJeu);
  } catch (error) {
    handleError(res, error, 400);
  }
};

exports.obtenirJeux = async (req, res) => {
  try {
    const jeux = await JeuService.obtenirJeux();
    res.json(jeux);
  } catch (error) {
    handleError(res, error);
  }
};

exports.obtenirJeuParId = async (req, res) => {
  try {
    const jeu = await JeuService.obtenirJeuParId(req.params.id);
    res.json(jeu);
  } catch (error) {
    handleError(res, error, 404);
  }
};

exports.mettreAJourJeu = async (req, res) => {
  try {
    const jeu = await JeuService.mettreAJourJeu(req.params.id, req.body);
    res.json(jeu);
  } catch (error) {
    handleError(res, error, 404);
  }
};

exports.supprimerJeu = async (req, res) => {
  try {
    await JeuService.supprimerJeu(req.params.id);
    res.json({ message: "Jeu supprimé avec succès" });
  } catch (error) {
    handleError(res, error, 404);
  }
};

exports.retirerJoueur = async (req, res) => {
  try {
    const { id, playerId } = req.params;
    const jeuMisAJour = await JeuService.retirerJoueur(id, playerId);
    res.json(jeuMisAJour);
  } catch (error) {
    handleError(res, error, 400);
  }
};

exports.ajouterPersonnage = async (req, res) => {
  try {
    const { id } = req.params;
    const { personnageId } = req.body;
    const jeuMisAJour = await JeuService.ajouterPersonnage(id, personnageId);
    res.json(jeuMisAJour);
  } catch (error) {
    handleError(res, error);
  }
};

exports.retirerPersonnage = async (req, res) => {
  try {
    const { id, personnageId } = req.params;
    const jeuMisAJour = await JeuService.retirerPersonnage(id, personnageId);
    res.json(jeuMisAJour);
  } catch (error) {
    handleError(res, error);
  }
};
