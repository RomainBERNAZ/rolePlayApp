const mongoose = require('mongoose');

const jeuSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Joueur' }],
  personnages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnage' }],
  statut: { type: String, enum: ['en_preparation', 'en_cours', 'termine'], default: 'en_preparation' },
  saisons: [{type: mongoose.Schema.Types.ObjectId, ref: 'Saison'}]  
});

module.exports = mongoose.model('Jeu', jeuSchema, 'jeux');
