import Saison from '../models/Saison.js';

class SaisonRepository {
  static async creer(saisonData) {
    const nouvelleSaison = new Saison(saisonData);
    return nouvelleSaison.save();
  }

  static async obtenirTous() {
    return Saison.find().populate('jeu', 'nom');
  }

  static async obtenirParId(id) {
    return Saison.findById(id)
      .populate('jeu', 'nom')
      .populate('personnages');
  }

  static async mettreAJour(id, donnees) {
    return Saison.findByIdAndUpdate(id, donnees, { new: true });
  }

  static async supprimer(id) {
    return Saison.findByIdAndDelete(id);
  }

  static async ajouterPersonnage(saisonId, personnageId) {
    return Saison.findByIdAndUpdate(
      saisonId,
      { $addToSet: { personnages: personnageId } },
      { new: true }
    );
  }

  static async retirerPersonnage(saisonId, personnageId) {
    return Saison.findByIdAndUpdate(
      saisonId,
      { $pull: { personnages: personnageId } },
      { new: true }
    );
  }
}

export default SaisonRepository;
