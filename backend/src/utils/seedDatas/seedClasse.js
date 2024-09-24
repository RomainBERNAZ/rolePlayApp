import Classe from '../../models/Classe.js';

const seedClasse = async () => {
  const classes = [
    {
      nom: 'Guerrier',
      description: 'Un combattant puissant et résistant',
      jeu: '66ea85e34126c2c46c9e23d9' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    },
    {
      nom: 'Mage',
      description: 'Un maître des arcanes et des sorts',
      jeu: '66ea85e34126c2c46c9e23d9' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    },
    {
      nom: 'Voleur',
      description: 'Un expert en furtivité et en agilité',
      jeu: '66ea85e34126c2c46c9e23d9' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    },
    {
      nom: 'Archer',
      description: 'Un expert en tir à l\'arc et en précision',
      jeu: '66ea85e34126c2c46c9e23d9' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    },
    {
      nom: 'Médecin',
      description: 'Un expert en soins et en médecine',
      jeu: '66ea85e34126c2c46c9e23d9' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    },
    {
      nom: 'Alchimiste',
      description: 'Un expert en alchimie et en potions',
      jeu: '66e9b9e5393385681c56575f' // Remplacez par un ObjectId valide de votre collection 'Jeu'
    }
  ];

  try {
    for (const classeData of classes) {
      const existingClasse = await Classe.findOne({ nom: classeData.nom, jeu: classeData.jeu });
      if (!existingClasse) {
        await Classe.create(classeData);
        console.log(`Classe "${classeData.nom}" insérée avec succès`);
      } else {
        console.log(`Classe "${classeData.nom}" déjà existante, ignorée`);
      }
    }
    console.log('Opération de seed des classes terminée');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des classes:', error);
  }
};

export default seedClasse;
