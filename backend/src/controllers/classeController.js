import Classe from '../models/Classe.js';

// Créer une nouvelle classe
export const createClasse = async (req, res) => {
  try {
    const { nom, description, jeu } = req.body;
    const newClasse = new Classe({ nom, description, jeu });
    const savedClasse = await newClasse.save();
    res.status(201).json(savedClasse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.find().populate('jeu');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une classe par son ID
export const getClasseById = async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id).populate('jeu');
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassesByJeuId = async (req, res) => {
  try {
    const classes = await Classe.find({ jeu: req.params.jeuId });
    console.log(classes);
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une classe
export const updateClasse = async (req, res) => {
  try {
    const { nom, description, jeu } = req.body;
    const updatedClasse = await Classe.findByIdAndUpdate(
      req.params.id,
      { nom, description, jeu },
      { new: true }
    );
    if (!updatedClasse) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }
    res.status(200).json(updatedClasse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une classe
export const deleteClasse = async (req, res) => {
  try {
    const deletedClasse = await Classe.findByIdAndDelete(req.params.id);
    if (!deletedClasse) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }
    res.status(200).json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createClasse,
  getAllClasses,
  getClasseById,
  getClassesByJeuId,
  updateClasse,
  deleteClasse
};
