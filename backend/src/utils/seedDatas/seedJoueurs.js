import Joueur from '../../models/Joueur.js';

async function seedJoueurs() {
  const joueurs = [
    { nom: 'Alice', email: 'alice@example.com', role: 'joueur' },
    { nom: 'Bob', email: 'bob@example.com', role: 'maitre_de_jeu' },
    { nom: 'Charlie', email: 'charlie@example.com', role: 'joueur' },
    { nom: 'David', email: 'david@example.com', role: 'admin' },
  ];

  for (const joueur of joueurs) {
    const existingJoueur = await Joueur.findOne({ email: joueur.email });
    if (!existingJoueur) {
      try {
        await Joueur.create({
          nom: joueur.nom,
          email: joueur.email,
          role: joueur.role,
        });
        console.log(`Joueur créé : ${joueur.email} (${joueur.role})`);
      } catch (error) {
        console.error(
          `Erreur lors de la création du joueur ${joueur.email}: ${error.message}`
        );
      }
    } else {
      console.log(`Le joueur ${joueur.email} (${joueur.role}) existe déjà`);
    }
  }
}

export default seedJoueurs;
