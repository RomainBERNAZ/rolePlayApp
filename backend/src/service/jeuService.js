import JeuRepository from '../repository/jeuRepository.js';

class JeuService {
  static async creerJeu(jeuData) {
    return await JeuRepository.creer(jeuData);
  }

  static async obtenirJeux() {
    return await JeuRepository.obtenirTous();
  }

  static async obtenirJeuParId(id) {
    const jeu = await JeuRepository.obtenirParId(id);
    if (!jeu) throw new Error("Jeu non trouvé");
    return jeu;
  }

  static async mettreAJourJeu(id, jeuData) {
    const jeu = await JeuRepository.mettreAJour(id, jeuData);
    if (!jeu) throw new Error("Jeu non trouvé");
    return jeu;
  }

  static async supprimerJeu(id) {
    const jeu = await JeuRepository.supprimer(id);
    if (!jeu) throw new Error("Jeu non trouvé");
    return jeu;
  }

  static async retirerJoueur(id, playerId) {
    const jeu = await this.obtenirJeuParId(id);
    const joueurIndex = jeu.joueurs.findIndex(joueur => joueur.toString() === playerId);
    if (joueurIndex === -1) throw new Error("Le joueur n'est pas dans ce jeu");

    jeu.joueurs.splice(joueurIndex, 1);
    await JeuRepository.sauvegarder(jeu);

    return await JeuRepository.obtenirParIdAvecPopulate(id);
  }

  static async ajouterPersonnage(id, personnageId) {
    const jeu = await this.obtenirJeuParId(id);
    jeu.personnages.push(personnageId);
    await JeuRepository.sauvegarder(jeu);
    return await JeuRepository.obtenirParIdAvecPopulate(id);
  }

  static async retirerPersonnage(id, personnageId) {
    try {
      const jeu = await this.obtenirJeuParId(id);
      const personnageIndex = jeu.personnages.findIndex(personnage => 
        personnage._id.toString() === personnageId
      );
      if (personnageIndex === -1) {
        throw new Error("Le personnage n'est pas dans ce jeu");
      }

      jeu.personnages.splice(personnageIndex, 1);

      const jeuMisAJour = await JeuRepository.sauvegarder(jeu);

      return await JeuRepository.obtenirParIdAvecPopulate(id);
    } catch (error) {
      console.error('Erreur dans retirerPersonnage:', error);
      throw error;
    }
  }
}

export default JeuService;
