const JoueurRepository = require('../repository/joueurRepository');
const PersonnageRepository = require('../repository/personnageRepository');

class JoueurService {
  static async creerJoueur(joueurData) {
    const { personnages, ...autresData } = joueurData;
    const nouveauJoueur = await JoueurRepository.creer(autresData);

    if (personnages && personnages.length > 0) {
      for (let personnageId of personnages) {
        const personnage = await PersonnageRepository.obtenirParId(personnageId);
        if (!personnage) {
          throw new Error(`Personnage avec l'ID ${personnageId} non trouvé`);
        }
        await JoueurRepository.ajouterPersonnage(nouveauJoueur._id, personnageId);
        await PersonnageRepository.definirJoueur(personnageId, nouveauJoueur._id);
      }
    }

    return nouveauJoueur;
  }

  static async obtenirJoueurs() {
    return JoueurRepository.obtenirTous();
  }

  static async obtenirJoueurParId(id) {
    return JoueurRepository.obtenirParId(id);
  }

  static async mettreAJourJoueur(id, donnees) {
    return JoueurRepository.mettreAJour(id, donnees);
  }

  static async supprimerJoueur(id) {
    return JoueurRepository.supprimer(id);
  }
}

module.exports = JoueurService;
