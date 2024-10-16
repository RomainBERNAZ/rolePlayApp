import PersonnageService from '../service/personnageService.js';
import handleError from '../utils/errorHandler.js';  

export const creerPersonnage = async (req, res) => {
  try {
    const nouveauPersonnage = await PersonnageService.creerPersonnage(req.body);
    res.status(201).json(nouveauPersonnage);
  } catch (error) {
    handleError(res, error);
  }
};

export const mettreAJourPersonnage = async (req, res) => {
  try {
    const { id } = req.params;
    const personnageMisAJour = await PersonnageService.mettreAJourPersonnage(id, req.body);
    if (!personnageMisAJour) {
      return res.status(404).json({ message: "Personnage non trouvé" });
    }
    res.json(personnageMisAJour);
  } catch (error) {
    handleError(res, error);
  }
};

export const supprimerPersonnage = async (req, res) => {
  try {
    const resultat = await PersonnageService.supprimerPersonnage(req.params.id);
    if (resultat) {
      res.json({ message: "Personnage supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Personnage non trouvé" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const obtenirPersonnages = async (req, res) => {
  try {
    const personnages = await PersonnageService.obtenirPersonnages();
    res.json(personnages);
  } catch (error) {
    handleError(res, error);
  }
};

export const obtenirPersonnageParId = async (req, res) => {
  try {
    const personnage = await PersonnageService.obtenirPersonnageParId(req.params.id);
    if (personnage) {
      res.json(personnage);
    } else {
      res.status(404).json({ message: "Personnage non trouvé" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export default {
  creerPersonnage,
  mettreAJourPersonnage,
  supprimerPersonnage,
  obtenirPersonnages,
  obtenirPersonnageParId,
};