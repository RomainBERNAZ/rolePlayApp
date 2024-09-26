import mongoose from 'mongoose';
import seedUsers from './seedDatas/seedUsers.js';
import seedJeux from './seedDatas/seedJeux.js';
import seedSaisons from './seedDatas/seedSaison.js';
import seedRoles from './seedDatas/seedRoles.js';
export const connectToMongoDBAndSeed = async (MONGODB_URI, isProduction) => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI n'est pas défini");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connecté à MongoDB ${isProduction ? 'Atlas' : 'local'}`);

    if (!isProduction) {
      await Promise.all([seedJeux(), seedSaisons(), seedRoles(), seedUsers()]);
      console.log('Données de test créées ou vérifiées');
    }
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err);
    throw err;
  }
};
