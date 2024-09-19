import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  
import axios from 'axios';
import Personnage from '../../types/personnage';
import Modal from '../../components/Modal/Modal.tsx';
import Joueur from '../../types/joueur.tsx';
import './Joueur.css';
import Table from '../../components/Table/Table.tsx';

const JoueurPage: React.FC = () => {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [personnages, setPersonnages] = useState<Personnage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJoueur, setNewJoueur] = useState<Omit<Joueur, '_id'>>({ nom: '', email: '', personnages: [] });

  useEffect(() => {
    fetchJoueurs();
    fetchPersonnages();
  }, []);

  const fetchJoueurs = async () => {
    try {
      const response = await axios.get<Joueur[]>('http://localhost:5000/joueurs?populate=personnages');
      setJoueurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des joueurs:', error);
      setError('Erreur lors de la récupération des joueurs. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPersonnages = async () => {
    try {
      const response = await axios.get<Personnage[]>('http://localhost:5000/personnages');
      setPersonnages(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des personnages:', error);
      setError('Erreur lors de la récupération des personnages. Veuillez réessayer.');
    }
  };

  const handleAddJoueur = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<Joueur>('http://localhost:5000/joueurs', newJoueur);
      
      // Fetch the newly created joueur with populated personnages
      const newJoueurResponse = await axios.get<Joueur>(`http://localhost:5000/joueurs/${response.data._id}?populate=personnages`);
      
      setJoueurs(prevJoueurs => [...prevJoueurs, newJoueurResponse.data]);
      setIsModalOpen(false);
      setNewJoueur({ nom: '', email: '', personnages: [] });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du joueur:', error);
      setError('Erreur lors de l\'ajout du joueur. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJoueur = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/joueurs/${id}`);
      setJoueurs(joueurs.filter(j => j._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du joueur:', error);
      setError('Erreur lors de la suppression du joueur. Veuillez réessayer.');
    }
  };

  const columns: Column<Joueur>[] = [
    {
      header: 'Nom',
      accessor: (joueur) => (
        <Link to={`/joueur/${joueur._id}`}>
          {joueur.nom}
        </Link>
      ),
    },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Personnages',
      accessor: (joueur) => (
        <>
          {joueur.personnages.map((personnage, index) => (
            <React.Fragment key={personnage._id || index}>
              {index > 0 && ', '}
              <Link to={`/personnage/${personnage._id}`}>
                {personnage.nom}
              </Link>
            </React.Fragment>
          ))}
        </>
      ),
    },
    {
      header: 'Actions',
      accessor: (joueur) => (
        <button className="bouton-supprimer" onClick={() => handleDeleteJoueur(joueur._id || '')}>
          Supprimer
        </button>
      ),
    },
  ];

  if (isLoading) return <div></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="joueur">
      <h1 className="titre-centre">Liste des Joueurs</h1>
      <button className="bouton-ouvrir-modale" onClick={() => setIsModalOpen(true)}>
        Créer un nouveau joueur
      </button>

      <Table
        data={joueurs}
        columns={columns}
        className="joueur-table"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleAddJoueur} className="formulaire-creation">
          <input
            type="text"
            value={newJoueur.nom}
            onChange={(e) => setNewJoueur({...newJoueur, nom: e.target.value})}
            placeholder="Nom du joueur"
            required
          />
          <input
            type="email"
            value={newJoueur.email}
            onChange={(e) => setNewJoueur({...newJoueur, email: e.target.value})}
            placeholder="Email du joueur"
            required
          />
          <select
            multiple
            value={newJoueur.personnages.map(p => p._id || '')}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
              const selectedPersonnages = personnages.filter(p => selectedIds.includes(p._id || ''));
              setNewJoueur({...newJoueur, personnages: selectedPersonnages});
            }}
          >
            {personnages.map((personnage) => (
              <option key={personnage._id} value={personnage._id}>
                {personnage.nom}
              </option>
            ))}
          </select>
          <button type="submit" className="bouton-ajouter">Ajouter</button>
        </form>
      </Modal>
    </div>
  );
};

export default JoueurPage;
