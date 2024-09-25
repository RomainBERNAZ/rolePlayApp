import { Saison } from "./saison";
import Joueur from "./joueur";
import Personnage from "./personnage";
import { Classe } from "./classe";
export interface Jeu {
  _id: string;
  nom: string;
  description: string;
  saisons: Saison[];
  joueurs: Joueur[];
  classes: Classe[];
  personnages: Personnage[];
  regles: string;
}
