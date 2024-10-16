import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { MultiValue } from 'react-select';
import './Personnage.css';
import Modal from '../../components/Modal/Modal.tsx';
import { PersonnageForm } from '../../components/Form/PersonnageForm.tsx';
import PersonnageList from './PersonnageList.tsx';
import FilterSection from '../../components/Filter/FilterSection.tsx';
import { OptionType } from '../../types/common';
import Personnage from '../../types/personnage';
import { API_URL } from '../../utils/constants';

const PersonnagePage: React.FC = () => {
  const [personnages, setPersonnages] = useState<Personnage[]>([]);
  const [filteredPersonnages, setFilteredPersonnages] = useState<Personnage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ classes: [], saisons: [], nomJdrs: [] });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPersonnages = useCallback(async () => {
    try {
      const response = await axios.get<Personnage[]>(`${API_URL}/personnages`);
      setPersonnages(response.data);
      setFilteredPersonnages(response.data);
      updateFilters(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des personnages:', error);
      setError('Erreur lors de la récupération des personnages. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnages();
  }, [fetchPersonnages]);

  const updateFilters = useCallback((personnages: Personnage[]) => {
    const uniqueClasses = [...new Set(personnages.map(p => p.classe))];
    const uniqueSaisons = [...new Set(personnages.map(p => p.saison).filter(Boolean))];
    const uniqueJoueurs = [...new Set(personnages.map(p => p.joueur?.nom).filter(Boolean))];

    setFilters({
      classes: uniqueClasses.map(classe => ({ value: classe, label: classe })),
      saisons: uniqueSaisons.map(saison => ({ value: saison, label: saison })),
      joueurs: uniqueJoueurs.map(joueur => ({ value: joueur, label: joueur }))
    });
  }, []);

  const handleFilterChange = useCallback((selectedOptions: MultiValue<OptionType>, filterType: string) => {
    const selectedValues = selectedOptions.map(option => option.value);
    const filtered = personnages.filter(personnage => {
      const matchesClasse = filterType === 'classes' ? selectedValues.length === 0 || selectedValues.includes(personnage.classe.nom) : true;
      const matchesSaison = filterType === 'saisons' ? selectedValues.length === 0 || (personnage.saison && selectedValues.includes(personnage.saison)) : true;
      const matchesJoueur = filterType === 'joueurs' ? selectedValues.length === 0 || (personnage.joueur && selectedValues.includes(personnage.joueur.nom)) : true;
      const matchesNom = personnage.nom.toLowerCase().startsWith(searchTerm.toLowerCase()); // Filtrage par nom
      return matchesClasse && matchesSaison && matchesJoueur && matchesNom; // Inclure le filtrage par nom
    });
    setFilteredPersonnages(filtered);
  }, [personnages, searchTerm]);

  const handleAddPersonnage = useCallback(async (newPersonnage: Omit<Personnage, '_id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ajouter le nouveau personnage
      const response = await axios.post<Personnage>(`${API_URL}/personnages`, newPersonnage);
      const addedPersonnage = response.data;

      setPersonnages(prev => [...prev, addedPersonnage]);
      setFilteredPersonnages(prev => [...prev, addedPersonnage]);
      updateFilters([...personnages, addedPersonnage]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du personnage:', error);
      setError('Erreur lors de l\'ajout du personnage ou de la mise à jour du jeu. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [personnages, updateFilters]);

  const handleDeletePersonnage = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/personnages/${id}`);
      const updatedPersonnages = personnages.filter(p => p._id !== id);
      setPersonnages(updatedPersonnages);
      setFilteredPersonnages(updatedPersonnages);
      updateFilters(updatedPersonnages);
    } catch (error) {
      console.error('Erreur lors de la suppression du personnage:', error);
      setError('Erreur lors de la suppression du personnage. Veuillez réessayer.');
    }
  }, [personnages, updateFilters]);

  if (isLoading) return <div></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="personnage">
      <h1 className="personnage__title">Liste des Personnages</h1>
      <button className="personnage__button" onClick={() => setIsModalOpen(true)}>
        Créer un nouveau personnage
      </button>

      <FilterSection 
        personnages={personnages} 
        onFilterChange={handleFilterChange} 
        searchTerm={searchTerm} // Passer le terme de recherche
        setSearchTerm={setSearchTerm} // Passer la fonction pour mettre à jour le terme de recherche
      />

      <PersonnageList 
        personnages={filteredPersonnages} 
        onDelete={handleDeletePersonnage} 
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PersonnageForm onSubmit={handleAddPersonnage} />
      </Modal>
    </div>
  );
};

export default PersonnagePage;