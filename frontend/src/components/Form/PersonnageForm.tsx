import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Personnage from '../../types/personnage';
import { Jeu } from '../../types/jeu';
import Joueur from '../../types/joueur'; // Importez l'interface Joueur existant
import { API_URL } from '../../utils/constants';
import { Classe } from '../../types/classe'; // Corrected import statement
import './PersonnageForm.css';
import { Race } from '../../types/races.tsx'; // Importez l'enum Races

interface PersonnageFormProps {
  onSubmit: (personnage: Omit<Personnage, '_id'>) => void;
}

export const PersonnageForm: React.FC<PersonnageFormProps> = ({ onSubmit }) => {
  const [personnage, setPersonnage] = useState<Omit<Personnage, '_id'>>({
    nom: 'Terrua',
    race: '',
    classe: {
      _id: '',
      nom: '',
      description: '',
      jeu: {
        _id: '',
        nom: '',
        description: '',
        saisons: [],
        joueurs: [],
        personnages: [],
        regles: '',
      },
    },
    experienceDisponible: 1,
    niveau: 1,
    pointsDeVie: 50,
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
  const [classes, setClasses] = useState<Classe[]>([]);

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
    setClasses([]); // Reset classes immediately when jeu changes
    if (selectedOption) {
      setPersonnage({ ...personnage, jeuId: selectedOption.value, classe: { _id: '', nom: '', description: '', jeu: personnage.classe.jeu } });
      fetchClasses(selectedOption.value);
    } else {
      setPersonnage({ ...personnage, jeuId: '', classe: { _id: '', nom: '', description: '', jeu: personnage.classe.jeu } });
    }
  };

  const fetchClasses = async (jeuId: string) => {
    try {
      const response = await axios.get<Classe[]>(`${API_URL}/classes/jeu/${jeuId}`);
      setClasses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      setClasses([]); // Ensure classes are reset on error
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

  const raceOptions = Object.values(Race).map(race => ({ value: race, label: race }));

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom du personnage</label>
      <input
        type="text"
        name="nom"
        value={personnage.nom}
        onChange={handleChange}
        placeholder="Nom du personnage"
        required
      />
      <label>Sélectionner un jeu</label>
      <Select
        options={jeux.map(jeu => ({ value: jeu._id, label: jeu.nom }))}
        onChange={handleJeuChange}
        placeholder="Sélectionner un jeu"
      />
      <label>Sélectionner une classe</label>
      <Select
        options={classes.map(classe => ({ value: classe._id, label: classe.nom }))}
        isDisabled={classes.length === 0} // Disable only if no classes are loaded
        placeholder="Sélectionner une classe"
        onChange={(selectedOption) => {
          if (selectedOption) {
            const selectedClasse = classes.find(c => c._id === selectedOption.value);
            setPersonnage({
              ...personnage,
              classe: selectedClasse || personnage.classe
            });
          } else {
            setPersonnage({
              ...personnage,
              classe: { _id: '', nom: '', description: '', jeu: personnage.classe.jeu }
            });
          }
        }}
        value={personnage.classe._id ? { value: personnage.classe._id, label: personnage.classe.nom } : null}
      />
      <label>Race</label>
      <Select
        options={raceOptions}
        value={personnage.race ? { value: personnage.race, label: personnage.race } : null}
        placeholder="Sélectionner une race"
        onChange={(selectedOption) => {
          if (selectedOption) {
            setPersonnage({ ...personnage, race: selectedOption.value });
          } else {
            setPersonnage({ ...personnage, race: '' });
          }
        }}
      />
      <label>Niveau</label>
      <input
        type="number"
        name="niveau"
        value={personnage.niveau}
        onChange={handleChange}
        placeholder="Niveau"
        required
      />
      <label>Sélectionner un joueur</label>
      <Select
        options={joueurs.map(joueur => ({ value: joueur._id, label: joueur.nom }))}
        onChange={handleJoueurChange}
        placeholder="Sélectionner un joueur"
      />
      <label>Saison</label>
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