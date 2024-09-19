const Participation = require('../models/participation');

class ParticipationRepository {
  static async creer(participationData) {
    const nouvelleParticipation = new Participation(participationData);
    return nouvelleParticipation.save();
  }

  static async obtenirTous() {
    return Participation.find()
      .populate('personnage')
      .populate('jeu');
  }

  static async obtenirParId(id) {
    return Participation.findById(id)
      .populate('personnage')
      .populate('jeu');
  }

  static async mettreAJour(id, donnees) {
    return Participation.findByIdAndUpdate(id, donnees, { new: true, runValidators: true });
  }

  static async supprimer(id) {
    return Participation.findByIdAndDelete(id);
  }

  static async supprimerParPersonnage(personnageId) {
    return Participation.deleteMany({ personnage: personnageId });
  }

  static async obtenirParPersonnage(personnageId) {
    return Participation.find({ personnage: personnageId })
      .populate('jeu');
  }

  static async obtenirParJeu(jeuId) {
    return Participation.find({ jeu: jeuId })
      .populate('personnage');
  }
}

module.exports = ParticipationRepository;
