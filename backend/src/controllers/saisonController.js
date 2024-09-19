const SaisonService = require('../service/saisonService');
const handleError = require('../utils/errorHandler');

exports.creerSaison = async (req, res) => {
  try {
    const nouvelleSaison = await SaisonService.creerSaison(req.body);
    res.status(201).json(nouvelleSaison);
  } catch (error) {
    handleError(res, error);
  }
};

exports.obtenirSaisons = async (req, res) => {
  try {
    const saisons = await SaisonService.obtenirSaisons();
    res.json(saisons);
  } catch (error) {
    handleError(res, error);
  }
};

exports.obtenirSaisonParId = async (req, res) => {
  try {
    const saison = await SaisonService.obtenirSaisonParId(req.params.id);
    if (!saison) return res.status(404).json({ message: "Saison non trouvée" });
    res.json(saison);
  } catch (error) {
    handleError(res, error);
  }
};

exports.mettreAJourSaison = async (req, res) => {
  try {
    const saison = await SaisonService.mettreAJourSaison(req.params.id, req.body);
    if (!saison) return res.status(404).json({ message: "Saison non trouvée" });
    res.json(saison);
  } catch (error) {
    handleError(res, error);
  }
};

exports.supprimerSaison = async (req, res) => {
  try {
    const resultat = await SaisonService.supprimerSaison(req.params.id);
    if (!resultat) return res.status(404).json({ message: "Saison non trouvée" });
    res.json({ message: "Saison supprimée avec succès" });
  } catch (error) {
    handleError(res, error);
  }
};

exports.ajouterPersonnage = async (req, res) => {
  try {
    const saison = await SaisonService.ajouterPersonnage(req.params.id, req.body.personnageId);
    if (!saison) return res.status(404).json({ message: "Saison non trouvée" });
    res.json(saison);
  } catch (error) {
    handleError(res, error);
  }
};

exports.retirerPersonnage = async (req, res) => {
  try {
    const saison = await SaisonService.retirerPersonnage(req.params.id, req.body.personnageId);
    if (!saison) return res.status(404).json({ message: "Saison non trouvée" });
    res.json(saison);
  } catch (error) {
    handleError(res, error);
  }
};
