import mongoose from 'mongoose'; 

// Mise à jour du schéma de personnage
const personnageSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
  niveau: { type: Number, required: true },
  race: { type: String, required: true },
  equipement: [String],
  competences: [String],
  participations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participation' }],
  saison: Number,
  nomJdr: String,
  joueur: { type: mongoose.Schema.Types.ObjectId, ref: 'Joueur' },
  pointsDeVie: Number,
});

const Personnage = mongoose.model('Personnage', personnageSchema);

export default Personnage;
