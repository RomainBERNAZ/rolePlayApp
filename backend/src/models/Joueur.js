const mongoose = require('mongoose');

const joueurSchema = new mongoose.Schema({
    nom: String,
    email: { type: String, unique: true },
    dateInscription: { type: Date, default: Date.now },
    personnages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnage' }],
    role: { type: String, enum: ['joueur', 'maitre_de_jeu', 'admin'], default: 'joueur' }
  });

  module.exports = mongoose.model('Joueur', joueurSchema);