import authService from '../service/authService.js';

// Fonction d'assainissement à implémenter
function sanitizeInput(input) {
  // Implémentez ici la logique d'assainissement appropriée
  // Par exemple, suppression des caractères spéciaux, limitation de la longueur, etc.
  return input.trim();
}

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Valider et assainir les entrées utilisateur
    if (!username || !password) {
      throw new Error("Nom d'utilisateur et mot de passe requis");
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    const result = await authService.login(
      sanitizedUsername,
      sanitizedPassword
    );

    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    await authService.register(username, email, password, role);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  await authService.logout(token);
  res.json({ message: 'Déconnexion réussie' });
};

export default {
  login,
  register,
  logout,
};
