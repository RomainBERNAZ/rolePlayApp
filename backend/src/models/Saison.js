import mongoose from 'mongoose'; 

const saisonSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  description: { type: String, required: true },
  titre: { type: String, required: true },
  jeu: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu', required: true }
});

export default mongoose.model('Saison', saisonSchema);
