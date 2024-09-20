import mongoose from 'mongoose'; 

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

export default mongoose.model('User', RaceSchema);