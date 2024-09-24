import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Jeu } from '../../types/jeu';
import Modal from '../../components/Modal/Modal.tsx';
import './Jeux.css';
import { API_URL } from '../../utils/constants';
import { UserContext } from '../../contexts/UserContext.tsx';
const Jeux: React.FC = () => {
  const navigate = useNavigate();
  const [jeux, setJeux] = useState<Jeu[]>([]);
  const [nouveauJeu, setNouveauJeu] = useState<Omit<Jeu, 'id' | '_id'>>({
    nom: '',
    description: '',
    saisons: [],
    joueurs: [],
    regles: '',
    personnages: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useContext(UserContext) || {};

  const fetchJeux = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Jeu[]>(`${API_URL}/jeux`);
      setJeux(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux', error);
      setError('Impossible de charger les jeux. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJeux();
  }, [fetchJeux]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNouveauJeu({ ...nouveauJeu, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/jeux`, nouveauJeu);
      await fetchJeux();
      setNouveauJeu({ nom: '', description: '', saisons: [], joueurs: [], regles: '', personnages: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du jeu', error);
      setError('Impossible de créer le jeu. Veuillez réessayer.');
    }
  };

  const handleJeuClick = (jeu: Jeu) => {
    navigate(`/jeux/${jeu._id}`, { state: { jeu } });
  };

  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="jeux-container">
      <h1>Gestion des Jeux de Rôle</h1>
      {isAdmin && (
        <button onClick={() => setIsModalOpen(true)} className="create-button">Créer un nouveau jeu</button>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="jeu-form">
          <input
            type="text"
            name="nom"
            value={nouveauJeu.nom}
            onChange={handleInputChange}
            placeholder="Nom du jeu"
            required
          />
          <textarea
            name="description"
            value={nouveauJeu.description}
            onChange={handleInputChange}
            placeholder="Description du jeu"
            required
          />
          <textarea
            name="regles"
            value={nouveauJeu.regles}
            onChange={handleInputChange}
            placeholder="Règles du jeu"
            required
          />
          <button type="submit">Créer le jeu</button>
        </form>
      </Modal>
      <div className="jeux-list">
        {jeux.map((jeu) => (
          <div key={jeu._id} className="jeu-item" onClick={() => handleJeuClick(jeu)}>
            <h3>{jeu.nom}</h3>
            <p>{jeu.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jeux;
