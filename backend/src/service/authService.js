import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const invalidatedTokens = new Set();

export const login = async (username, password) => {
  const user = await User.findOne({ username }).populate('role');
  console.log(user);
  if (!user) {
    throw { status: 400, message: "Utilisateur non trouvé" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 400, message: "Mot de passe incorrect" };
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user._id, username: user.username, role: user.role.name } };
};

export const register = async (username, email, password, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: 'Cet email est déjà utilisé' };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({ username, email, password: hashedPassword, role });
};

export const logout = async (token) => {
  if (token) {
    invalidatedTokens.add(token);
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
  logout
};
