import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';
import axios from 'axios'; // Assurez-vous d'avoir installé axios
import { API_URL } from '../../utils/constants';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('accueil');
  const navigate = useNavigate();

  const tabs = [
    { id: 'accueil', label: 'Accueil', path: '/' },
    { id: 'joueur', label: 'Joueur', path: '/joueurs' },
    { id: 'personnage', label: 'Personnage', path: '/personnages' },
    { id: 'jeux', label: 'Jeux', path: '/jeux' },
  ];

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // Supprime le token du localStorage
      localStorage.removeItem('token');

      // Supprime le token des en-têtes par défaut d'axios
      delete axios.defaults.headers.common['token'];

      // Envoie une requête de déconnexion au serveur
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { 'x-auth-token': null }
      });

      // Redirige vers la page de connexion et force le rechargement
      navigate('/', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <nav className="tab-menu">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => handleTabClick(tab.id, tab.path)}
            >
              {tab.label}
            </button>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;