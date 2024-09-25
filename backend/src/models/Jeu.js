import mongoose from 'mongoose'; 

const jeuSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Joueur' }],
  personnages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnage' }],
  statut: { type: String, enum: ['en_preparation', 'en_cours', 'termine'], default: 'en_preparation' },
  classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Classe'}],
  saisons: [{type: mongoose.Schema.Types.ObjectId, ref: 'Saison'}]  
});

export default mongoose.model('Jeu', jeuSchema, 'jeux');
