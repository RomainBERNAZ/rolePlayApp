const Jeu = require('../../models/Jeu'); 
const Saison = require('../../models/Saison');

async function seedJeux() {
  const jeux = [
    {
      nom: 'L\'Épopée Fantastique',
      description: 'Un jeu de rôle médiéval-fantastique rempli d\'aventures épiques',
      statut: 'en_preparation',
      saisons: [
        { numero: 1, nom: 'L\'Éveil des Héros', description: 'Le début de l\'aventure', titre: 'Saison 1' },
        { numero: 2, nom: 'La Quête du Dragon', description: 'La suite épique', titre: 'Saison 2' }
      ]
    },
    {
      nom: 'Mystères de la Galaxie',
      description: 'Explorez l\'espace et résolvez des énigmes intergalactiques',
      statut: 'en_cours',
      saisons: [
        { numero: 1, nom: 'Premiers Contacts', description: 'Découverte de nouvelles civilisations' },
        { numero: 2, nom: 'La Nébuleuse Perdue', description: 'Exploration d\'une mystérieuse nébuleuse' },
        { numero: 3, nom: 'L\'Alliance Stellaire', description: 'Formation d\'une alliance intergalactique' }
      ]
    },
    {
      nom: 'Chroniques du Steampunk',
      description: 'Aventures dans un monde victorien alternatif rempli de machines à vapeur',
      statut: 'en_preparation',
      saisons: [
        { numero: 1, nom: 'Les Débuts de la Révolution', description: 'L\'émergence de la technologie à vapeur' },
        { numero: 2, nom: 'La Guerre des Machines', description: 'Conflit entre factions technologiques' }
      ]
    },
    {
      nom: 'Légendes des Océans',
      description: 'Naviguez sur les mers et découvrez des trésors cachés',
      statut: 'termine',
      saisons: [
        { numero: 1, nom: 'Les Îles Perdues', description: 'Exploration d\'îles mystérieuses' },
        { numero: 2, nom: 'La Mer des Sables', description: 'Aventure dans un désert océanique' }
      ]
    }
  ];

  for (const jeuData of jeux) {
    const existingJeu = await Jeu.findOne({ nom: jeuData.nom });
    if (!existingJeu) {
      try {
        // Créer d'abord le jeu sans les saisons
        const nouveauJeu = new Jeu({
          nom: jeuData.nom,
          description: jeuData.description,
          statut: jeuData.statut
        });
        await nouveauJeu.save();

        // Créer ensuite les saisons
        const saisonIds = await Promise.all(jeuData.saisons.map(async (saison) => {
          const nouvelleSaison = new Saison({
            ...saison,
            jeu: nouveauJeu._id,
            titre: saison.nom, // Utiliser le nom comme titre si non fourni
            description: saison.description || `Description de la saison ${saison.numero}` // Description par défaut
          });
          await nouvelleSaison.save();
          return nouvelleSaison._id;
        }));

        // Mettre à jour le jeu avec les IDs des saisons
        nouveauJeu.saisons = saisonIds;
        await nouveauJeu.save();

        console.log(`Jeu créé : ${jeuData.nom}`);
      } catch (error) {
        console.error(`Erreur lors de la création du jeu ${jeuData.nom}: ${error.message}`);
      }
    } else {
      console.log(`Le jeu ${jeuData.nom} existe déjà`);
    }
  }
}

module.exports = seedJeux;

