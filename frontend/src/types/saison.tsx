export interface Saison {
    _id: number;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    numero: number;
    jeuId: number;
    description?: string;
}

export default Saison;
