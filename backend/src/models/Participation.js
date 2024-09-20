import mongoose from 'mongoose';

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

export default mongoose.model('Participation', participationSchema);
