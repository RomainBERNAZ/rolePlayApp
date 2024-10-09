import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (username, password) => {
  // Utiliser une méthode de recherche sécurisée
  const user = await User.findByUsername(username);

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Mot de passe incorrect');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return {
    token,
    user: { id: user._id, username: user.username, role: user.role.name },
  };
};

export const register = async (username, email, password, role) => {
  // Utiliser une méthode de recherche sécurisée
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Utiliser une liste prédéfinie de rôles valides
  const validRoles = ['user', 'admin', 'moderator']; // Ajoutez ou modifiez selon vos besoins
  const sanitizedRole = validRoles.includes(role) ? role : 'user';

  const newUser = new User({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: sanitizedRole,
  });

  await newUser.save();
};

export const logout = async (token) => {
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Utilisateur ${decoded.id} déconnecté`);
    } catch (error) {
      console.log('Token invalide ou expiré');
    }
  }
};

export default {
  login,
  register,
  logout,
};
