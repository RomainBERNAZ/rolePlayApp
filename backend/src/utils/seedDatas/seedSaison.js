const mongoose = require('mongoose');
const Saison = require('../../models/Saison');
const Jeu = require('../../models/Jeu');

async function seedSaisons() {
  try {
    // Récupérer tous les jeux existants
    const jeux = await Jeu.find();

    if (jeux.length === 0) {
      console.log("Aucun jeu trouvé. Veuillez d'abord créer des jeux.");
      return;
    }

    const saisons = [
      {
        numero: 1,
        titre: "Le Début de l'Aventure",
        description: "La première saison où les héros se rencontrent et commencent leur quête.",
        jeu: jeux[0]._id,
        dateDebut: new Date(),
        statut: 'en_cours'
      },
      {
        numero: 2,
        titre: "L'Ascension des Ombres",
        description: "Les héros font face à de nouveaux défis et des ennemis plus puissants.",
        jeu: jeux[0]._id,
        dateDebut: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        statut: 'en_preparation'
      },
      {
        numero: 1,
        titre: "Les Origines",
        description: "Découvrez les origines des personnages dans ce nouveau jeu passionnant.",
        jeu: jeux[1] ? jeux[1]._id : jeux[0]._id,
        dateDebut: new Date(),
        statut: 'en_preparation'
      }
    ];

    for (const saison of saisons) {
      const existingSaison = await Saison.findOne({ numero: saison.numero, jeu: saison.jeu });
      if (!existingSaison) {
        const nouvelleSaison = await Saison.create(saison);
        console.log(`Saison créée : ${nouvelleSaison.titre} (Jeu: ${nouvelleSaison.jeu})`);

        // Mettre à jour le jeu associé avec l'ObjectId de la nouvelle saison
        await Jeu.findByIdAndUpdate(
          saison.jeu,
          { $push: { saisons: nouvelleSaison._id } }
        );
      } else {
        console.log(`La saison ${saison.numero} pour le jeu ${saison.jeu} existe déjà.`);
      }
    }

    console.log("Peuplement des saisons terminé.");
  } catch (error) {
    console.error("Erreur lors du peuplement des saisons:", error);
  }
}

module.exports = seedSaisons;
