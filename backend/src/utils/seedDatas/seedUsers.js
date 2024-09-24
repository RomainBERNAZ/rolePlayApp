import bcrypt from 'bcrypt';
import User from '../../models/User.js'; 
import Role from '../../models/Role.js'; // Ajout de l'importation du modèle Role

async function seedUsers() {
  const roles = {
    admin: await Role.findOne({ name: 'Admin' }),
    joueur: await Role.findOne({ name: 'User' }), // Correction du nom du rôle
    mj: await Role.findOne({ name: 'Admin' }),
    moderateur: await Role.findOne({ name: 'User' }),
  };

  const users = [
    { username: 'admin', email: 'admin@example.com', password: 'admin', role: roles.admin },
    { username: 'joueur', email: 'joueur@example.com', password: 'joueurpass123', role: roles.joueur },
    { username: 'mj', email: 'mj@example.com', password: 'mjpass123', role: roles.mj },
    { username: 'moderateur', email: 'moderateur@example.com', password: 'modpass123', role: roles.moderateur },
  ];

  for (const user of users) {
    const existingUser = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      try {
        await User.create({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          role: user.role._id, // Utilisation de l'ID du rôle
        });
        console.log(`Utilisateur créé : ${user.email} (${user.role.name})`); // Modification pour afficher le nom du rôle
      } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur ${user.email}: ${error.message}`);
      }
    } else {
      console.log(`L'utilisateur ${user.email} ou ${user.username} (${user.role.name}) existe déjà`); // Modification pour afficher le nom du rôle
    }
  }
}

export default seedUsers;
