import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Login.css';
import { API_URL } from '../../utils/constants';
import Modal from '../Modal/Modal.tsx';
import { UserContext } from '../../contexts/UserContext.tsx';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setUserRole } = useContext(UserContext) || {};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user } = response.data;
      onLogin(token, user);
      if (setUserRole) {
        setUserRole(user.role);
      }
      // Le stockage du token est déjà géré dans la fonction handleLogin du composant App
    } catch (error) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const handleRegister = async (userData: { username: string; email: string; password: string; role: string }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      alert(response.data.message); // Affiche le message de succès
      setIsModalOpen(false);
    } catch (error) {
      setError('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <button type="button" onClick={() => setIsModalOpen(true)}>Créer un compte</button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RegisterForm onRegister={handleRegister} />
      </Modal>
    </div>
  );
};

interface RegisterFormProps {
  onRegister: (userData: { username: string; email: string; password: string; role: string }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ username, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Inscription</h3>
      <div>
        <label htmlFor="register-username">Nom d'utilisateur:</label>
        <input
          type="text"
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="register-email">Email:</label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="register-password">Mot de passe:</label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="register-role">Rôle:</label>
        <input
          type="text"
          id="register-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Login;