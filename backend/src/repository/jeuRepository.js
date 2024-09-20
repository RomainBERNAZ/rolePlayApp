import Jeu from '../models/Jeu.js'; 

class JeuRepository {
  static async creer(jeuData) {
    const nouveauJeu = new Jeu(jeuData);
    return await nouveauJeu.save();
  }

  static async obtenirTous() {
    return await Jeu.find()
      .populate('joueurs', 'nom')
      .populate('saisons')
      .populate('personnages');
  }

  static async obtenirParId(id) {
    return await Jeu.findById(id)
      .populate('joueurs', 'nom email')
      .populate('personnages')
      .populate('saisons', '_id numero');
  }

  static async obtenirParIdAvecPopulate(id) {
    return await Jeu.findById(id)
      .populate('joueurs', 'nom email')
      .populate('personnages')
      .populate('saisons', '_id numero');
  }

  static async mettreAJour(id, jeuData) {
    return await Jeu.findByIdAndUpdate(id, jeuData, { new: true });
  }

  static async supprimer(id) {
    return await Jeu.findByIdAndDelete(id);
  }

  static async sauvegarder(jeu) {
    return await jeu.save();
  }

  static async retirerPersonnage(personnageId) {
    return Jeu.updateMany(
      { personnages: personnageId },
      { $pull: { personnages: personnageId } }
    );
  }

  static async ajouterPersonnage(jeuId, personnageId) {
    return Jeu.findByIdAndUpdate(
      jeuId,
      { $addToSet: { personnages: personnageId } },
      { new: true }
    );
  }

  static async ajouterJoueur(jeuId, joueurId) {
    return Jeu.findByIdAndUpdate(
      jeuId,
      { $addToSet: { joueurs: joueurId } },
      { new: true }
    ).populate('joueurs', 'nom email');
  }

}

export default JeuRepository;
