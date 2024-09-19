import { Jeu } from "./jeu";
import Saison from "./saison";
import Joueur from "./joueur";

interface Personnage {
  readonly _id?: string;
  nom: string;
  classe: string;
  race: string;
  niveau: number;
  pointsDeVie: number;
  equipement: readonly string[];
  competences: readonly string[];
  participations: readonly Participation[];
  jeuId: string;
  joueur: Joueur;
  saison: string;
}

interface Participation {
  readonly jeu: Jeu;
  readonly saison: readonly Saison[];
}

export default Personnage;
