import mongoose from 'mongoose';

const classeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  jeu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jeu',
    required: true
  }
});

const Classe = mongoose.model('Classe', classeSchema);

export default Classe;
