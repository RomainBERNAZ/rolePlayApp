const mongoose = require('mongoose');

const RaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Ajoutez d'autres champs si nécessaire
});

module.exports = mongoose.model('User', RaceSchema);