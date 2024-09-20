import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../../models/User.js'; // Assurez-vous que le chemin est correct

async function seedUsers() {
  const users = [
    { username: 'admin', email: 'admin@example.com', password: 'admin', role: 'Admin' },
    { username: 'joueur', email: 'joueur@example.com', password: 'joueurpass123', role: 'Joueur' },
    { username: 'mj', email: 'mj@example.com', password: 'mjpass123', role: 'MJ' },
    { username: 'moderateur', email: 'moderateur@example.com', password: 'modpass123', role: 'Moderateur' },
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
          role: user.role,
        });
        console.log(`Utilisateur créé : ${user.email} (${user.role})`);
      } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur ${user.email}: ${error.message}`);
      }
    } else {
      console.log(`L'utilisateur ${user.email} ou ${user.username} (${user.role}) existe déjà`);
    }
  }
}

export default seedUsers;
