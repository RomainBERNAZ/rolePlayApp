import PersonnageRepository from '../repository/personnageRepository.js';
import JoueurRepository from '../repository/joueurRepository.js';
import JeuRepository from '../repository/jeuRepository.js';
import ParticipationRepository from '../repository/participationRepository.js';

class PersonnageService {
  static async creerPersonnage(personnageData) {
    const { joueur, jeuId, saisons, ...autresData } = personnageData;
    const nouveauPersonnage = await PersonnageRepository.creer(autresData);

    if (joueur && joueur._id) {
      await this.associerJoueur(nouveauPersonnage._id, joueur._id);
    }

    if (jeuId) {
      await this.associerJeu(nouveauPersonnage._id, jeuId, saisons);
    }

    return PersonnageRepository.obtenirParId(nouveauPersonnage._id);
  }

  static async associerJoueur(personnageId, joueurId) {
    const joueur = await JoueurRepository.obtenirParId(joueurId);
    if (!joueur) {
      throw new Error("Joueur non trouvé");
    }
    await PersonnageRepository.definirJoueur(personnageId, joueurId);
    await JoueurRepository.ajouterPersonnage(joueurId, personnageId);
  }

  static async associerJeu(personnageId, jeuId, saisons) {
    const jeu = await JeuRepository.obtenirParId(jeuId);
    if (!jeu) {
      throw new Error("Jeu non trouvé");
    }
    const personnage = await PersonnageRepository.obtenirParId(personnageId);
    if (!personnage) {
      throw new Error("Personnage non trouvé");
    }
    const participation = await ParticipationRepository.creer({
      personnage: personnageId,
      jeu: jeuId,
      saisons: saisons,
      statut: 'en attente'
    });
    await PersonnageRepository.ajouterParticipation(personnageId, participation._id);
    await JeuRepository.ajouterPersonnage(jeuId, personnageId);
    
    // Associer le joueur au jeu si le personnage a un joueur
    if (personnage.joueur) {
      await JeuRepository.ajouterJoueur(jeuId, personnage.joueur);
    }
  }

  static async mettreAJourPersonnage(id, donnees) {
    const { jeu, saisons, ...autresDonnees } = donnees;
    const personnage = await PersonnageRepository.mettreAJour(id, autresDonnees);
    if (!personnage) {
      return null;
    }
    if (jeu) {
      await this.associerJeu(personnage._id, jeu._id, saisons);
    }
    return PersonnageRepository.obtenirParId(id);
  }

  static async supprimerPersonnage(id) {
    const personnage = await PersonnageRepository.obtenirParId(id);
    if (!personnage) {
      return false;
    }
    if (personnage.joueur) {
      await JoueurRepository.supprimerPersonnage(personnage.joueur, id);
    }
    await JeuRepository.retirerPersonnage(id);
    await ParticipationRepository.supprimerParPersonnage(id);
    await PersonnageRepository.supprimer(id);
    return true;
  }

  static async obtenirPersonnages() {
    return PersonnageRepository.obtenirTous();
  }

  static async obtenirPersonnageParId(id) {
    return PersonnageRepository.obtenirParId(id);
  }
}

export default PersonnageService;
