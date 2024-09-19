import Personnage from "./personnage";
import { Jeu } from "./jeu";

interface Joueur {
    _id?: string;
    nom: string;
    email: string;
    personnages: Personnage[];
    jeux: Jeu[];
  }

  export default Joueur;