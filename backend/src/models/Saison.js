const mongoose = require('mongoose');

const saisonSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  description: { type: String, required: true },
  titre: { type: String, required: true },
  jeu: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu', required: true }
});

module.exports = mongoose.model('Saison', saisonSchema);
