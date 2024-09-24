import authService from '../service/authService.js';



export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await authService.login(username, password);
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
        res.status(error.status || 500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
};

export const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logout(token);
    res.json({ message: "Déconnexion réussie" });
};

export default {
    login,
    register,
    logout
};