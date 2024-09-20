import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Personnage from '../../types/personnage';
import { Jeu } from '../../types/jeu';
import Joueur from '../../types/joueur'; // Importez l'interface Joueur existant
import { API_URL } from '../../utils/constants';

interface PersonnageFormProps {
  onSubmit: (personnage: Omit<Personnage, '_id'>) => void;
}

export const PersonnageForm: React.FC<PersonnageFormProps> = ({ onSubmit }) => {
  const [personnage, setPersonnage] = useState<Omit<Personnage, '_id'>>({
    nom: 'Terrua',
    classe: 'Druide',
    race: 'Druidnis',
    niveau: 1,
    pointsDeVie: 0,
    equipement: [],
    competences: [],
    participations: [],
    jeuId: '', 
    joueur: {
      _id: '',
      nom: '',
      email: '',
      personnages: [],
      jeux: [],
    }, 
    saison: '1', // Assurez-vous que cette ligne existe
  });
  const [jeux, setJeux] = useState<Jeu[]>([]);
  const [joueurs, setJoueurs] = useState<Joueur[]>([]); // Utilisation de l'interface Joueur importée

  useEffect(() => {
    const fetchJeux = async () => {
      try {
          const response = await axios.get<Jeu[]>(`${API_URL}/jeux`);
        setJeux(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des jeux:', error);
      }
    };
    const fetchJoueurs = async () => {
      try {
        const response = await axios.get<Joueur[]>(`${API_URL}/joueurs`);
        setJoueurs(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des joueurs:', error);
      }
    };

    fetchJeux();
    fetchJoueurs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonnage({ ...personnage, [name]: value });
  };

  const handleJeuChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setPersonnage({ ...personnage, jeuId: selectedOption.value });
    }
  };

  const handleJoueurChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const selectedJoueur = joueurs.find(joueur => joueur._id === selectedOption.value);
      if (selectedJoueur) {
        setPersonnage({ ...personnage, joueur: selectedJoueur });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(personnage);
    console.log(personnage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nom"
        value={personnage.nom}
        onChange={handleChange}
        placeholder="Nom du personnage"
        required
      />
      <input
        type="text"
        name="classe"
        value={personnage.classe}
        onChange={handleChange}
        placeholder="Classe"
        required
      />
      <input
        type="text"
        name="race"
        value={personnage.race}
        onChange={handleChange}
        placeholder="Race"
        required
      />
      <input
        type="number"
        name="niveau"
        value={personnage.niveau}
        onChange={handleChange}
        placeholder="Niveau"
        required
      />
      <Select
        options={jeux.map(jeu => ({ value: jeu._id, label: jeu.nom }))}
        onChange={handleJeuChange}
        placeholder="Sélectionner un jeu"
      />
      <Select
        options={joueurs.map(joueur => ({ value: joueur._id, label: joueur.nom }))}
        onChange={handleJoueurChange}
        placeholder="Sélectionner un joueur"
      />
      <input
        type="text"
        name="saison"
        value={personnage.saison}
        onChange={handleChange}
        placeholder="Saison"
      />
      <button type="submit">Créer le personnage</button>
    </form>
  );
};