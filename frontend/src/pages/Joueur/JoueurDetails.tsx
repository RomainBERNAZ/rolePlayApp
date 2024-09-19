import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JoueurDetails.css';
import Joueur from '../../types/joueur';

const JoueurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedJoueur, setEditedJoueur] = useState<Joueur | null>(null);
  const navigate = useNavigate();

  const fetchJoueur = useCallback(async () => {
    try {
      const response = await axios.get<Joueur>(`http://localhost:5000/joueurs/${id}`);
      setJoueur(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur:', error);
      setError('Erreur lors de la récupération du joueur. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJoueur();
  }, [fetchJoueur]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedJoueur(joueur);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedJoueur(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedJoueur) return;

    try {
      await axios.put(`http://localhost:5000/joueurs/${id}`, editedJoueur);
      setJoueur(editedJoueur);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du joueur:', error);
      setError('Erreur lors de la mise à jour du joueur. Veuillez réessayer.');
    }
  };

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!joueur) return <div className="not-found">Joueur non trouvé.</div>;

  return (
    <div className="joueur-detail">
      <h1>{joueur.prenom} {joueur.nom}</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="joueur-form">
          <input
            type="text"
            name="nom"
            value={editedJoueur?.nom || ''}
            onChange={handleChange}
            placeholder="Nom"
          />
          <input
            type="text"
            name="prenom"
            value={editedJoueur?.prenom || ''}
            onChange={handleChange}
            placeholder="Prénom"
          />
          <input
            type="email"
            name="email"
            value={editedJoueur?.email || ''}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="date"
            name="dateInscription"
            value={editedJoueur?.dateInscription || ''}
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </form>
      ) : (
        <div className="joueur-info">
          <p><strong>Email:</strong> {joueur.email}</p>
          {joueur.dateInscription && <p><strong>Date d'inscription:</strong> {new Date(joueur.dateInscription).toLocaleDateString()}</p>}
          <button onClick={handleEdit} className="edit-button">Modifier</button>
        </div>
      )}
      <Link to="/joueurs" className="bouton-retour">Retour à la liste</Link>
    </div>
  );
};

export default JoueurDetail;