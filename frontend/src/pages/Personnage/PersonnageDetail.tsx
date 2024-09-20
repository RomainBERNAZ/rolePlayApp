import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PersonnageDetail.css';
import Personnage from '../../types/personnage';
import { API_URL } from '../../utils/constants';

const PersonnageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [personnage, setPersonnage] = useState<Personnage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPersonnage, setEditedPersonnage] = useState<Personnage | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonnage = async () => {
      try {
        const response = await axios.get<Personnage>(`${API_URL}/personnages/${id}`);
        setPersonnage(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du personnage:', error);
        setError('Erreur lors de la récupération du personnage. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonnage();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPersonnage(personnage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPersonnage(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedPersonnage) return;

    try {
      await axios.put(`${API_URL}/personnages/${id}`, editedPersonnage);
      setPersonnage(editedPersonnage);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du personnage:', error);
      setError('Erreur lors de la mise à jour du personnage. Veuillez réessayer.');
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!personnage) return <div>Personnage non trouvé.</div>;

  return (
    <div className="personnage-detail">
      <h1>{personnage.nom}</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom"
            value={editedPersonnage?.nom || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="classe"
            value={editedPersonnage?.classe || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="saison"
            value={editedPersonnage?.saison || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="nomJdr"
            value={editedPersonnage?.nomJdr || ''}
            onChange={handleChange}
          />
          <input
            type="text"
            name="race"
            value={editedPersonnage?.race || ''}
            onChange={handleChange}
          />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      ) : (
        <div className="personnage-info">
          <p><strong>Classe:</strong> {personnage.classe}</p>
          <p><strong>Race:</strong> {personnage.race}</p>
          {personnage.saison && <p><strong>Saison:</strong> {personnage.saison}</p>}
          {personnage.nomJdr && <p><strong>Nom du JDR:</strong> {personnage.nomJdr}</p>}
          <button onClick={handleEdit}>Modifier</button>
        </div>
      )}
      <Link to="/personnages" className="bouton-retour">Retour à la liste</Link>
    </div>
  );
};

export default PersonnageDetail;