import Joueur from '../models/Joueur.js'; 

class JoueurRepository {
  static async creer(joueurData) {
    const nouveauJoueur = new Joueur(joueurData);
    return nouveauJoueur.save();
  }

  static async obtenirTous() {
    return Joueur.find().populate('personnages');
  }

  static async obtenirParId(id) {
    return Joueur.findById(id).populate('personnages');
  }

  static async mettreAJour(id, donnees) {
    return Joueur.findByIdAndUpdate(id, donnees, { new: true });
  }

  static async supprimer(id) {
    return Joueur.findByIdAndDelete(id);
  }

  static async ajouterPersonnage(joueurId, personnageId) {
    return Joueur.findByIdAndUpdate(
      joueurId,
      { $push: { personnages: personnageId } },
      { new: true }
    );
  }

  static async supprimerPersonnage(joueurId, personnageId) {
    return Joueur.findByIdAndUpdate(
      joueurId,
      { $pull: { personnages: personnageId } },
      { new: true }
    );
  }
}

export default JoueurRepository;
