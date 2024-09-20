import Personnage from '../models/personnage.js';

class PersonnageRepository {
  static async creer(personnageData) {
    const nouveauPersonnage = new Personnage(personnageData);
    return nouveauPersonnage.save();
  }

  static async obtenirTous() {
    return Personnage.find()
      .populate({
        path: 'participations',
        populate: { path: 'jeu' }
      })
      .populate('joueur');
  }

  static async obtenirParId(id) {
    return Personnage.findById(id)
      .populate({
        path: 'participations',
        populate: { path: 'jeu' }
      })
      .populate('joueur');
  }

  static async mettreAJour(id, donnees) {
    return Personnage.findByIdAndUpdate(id, donnees, { new: true, runValidators: true });
  }

  static async supprimer(id) {
    return Personnage.findByIdAndDelete(id);
  }

  static async definirJoueur(personnageId, joueurId) {
    return Personnage.findByIdAndUpdate(personnageId, { joueur: joueurId }, { new: true });
  }

  static async ajouterParticipation(personnageId, participationId) {
    return Personnage.findByIdAndUpdate(
      personnageId,
      { $push: { participations: participationId } },
      { new: true }
    );
  }
}

export default PersonnageRepository;
