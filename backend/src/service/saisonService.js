const SaisonRepository = require('../repository/saisonRepository.js');
const JeuRepository = require('../repository/jeuRepository.js');

class SaisonService {
  static async creerSaison(saisonData) {
    const nouvelleSaison = await SaisonRepository.creer(saisonData);
    await JeuRepository.ajouterSaison(saisonData.jeu, nouvelleSaison._id);
    return nouvelleSaison;
  }

  static async obtenirSaisons() {
    return SaisonRepository.obtenirTous();
  }

  static async obtenirSaisonParId(id) {
    return SaisonRepository.obtenirParId(id);
  }

  static async mettreAJourSaison(id, donnees) {
    return SaisonRepository.mettreAJour(id, donnees);
  }

  static async supprimerSaison(id) {
    const saison = await SaisonRepository.obtenirParId(id);
    if (!saison) return false;
    await JeuRepository.retirerSaison(saison.jeu, id);
    await SaisonRepository.supprimer(id);
    return true;
  }

  static async ajouterPersonnage(saisonId, personnageId) {
    return SaisonRepository.ajouterPersonnage(saisonId, personnageId);
  }

  static async retirerPersonnage(saisonId, personnageId) {
    return SaisonRepository.retirerPersonnage(saisonId, personnageId);
  }
}

module.exports = SaisonService;
