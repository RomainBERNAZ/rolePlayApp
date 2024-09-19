import { Saison } from "./saison";
import Joueur from "./joueur";
import Personnage from "./personnage";

export interface Jeu {
  _id: string;
  nom: string;
  description: string;
  saisons: Saison[];
  joueurs: Joueur[];
  personnages: Personnage[];
  regles: string;
}
