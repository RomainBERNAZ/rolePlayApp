const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
  personnage: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnage' },
  jeu: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu' },
  saisons: [{ type: Number }],
  statut: {
    type: String,
    enum: ['confirmé', 'en attente', 'annulé'],
    default: 'en attente'
  }
  // Autres champs nécessaires
}, { timestamps: true });

module.exports = mongoose.model('Participation', participationSchema);
