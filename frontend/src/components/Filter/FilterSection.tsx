import React, { useMemo } from 'react';
import Select, { MultiValue } from 'react-select';
import { OptionType } from '../../types/common';
import Personnage from '../../types/personnage';
import './FilterSection.css';



interface FilterSectionProps {
  personnages: Personnage[];
  onFilterChange: (selectedOptions: MultiValue<OptionType>, filterType: string) => void;  
}

const FilterSection: React.FC<FilterSectionProps> = ({ personnages, onFilterChange }) => {
  const getUniqueOptions = (key: string): OptionType[] => {
    if (!personnages || personnages.length === 0) return [];
    const uniqueValues = Array.from(new Set(personnages.map(p => {
      const keys = key.split('.');
      return keys.reduce((obj, k) => obj && obj[k as keyof typeof obj], p as any);
    }))).filter((value): value is string => value !== null && value !== undefined);
    return uniqueValues.map(value => ({ value, label: value }));
  };

  const classes = useMemo(() => getUniqueOptions('classe'), [personnages]);
  const saisons = useMemo(() => getUniqueOptions('saison'), [personnages]);
  const joueurs = useMemo(() => getUniqueOptions('joueur.nom'), [personnages]);


  if (!personnages || personnages.length === 0) {
    return <div>Aucun personnage disponible</div>;
  }

  return (
    <div className="filter-section">
      <h2>Filtres</h2>
      <Select
        options={classes}
        onChange={(option) => onFilterChange(option, 'classes')}
        placeholder="Filtrer par classe"
        isClearable
        isMulti
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <Select
        options={saisons}
        onChange={(option) => onFilterChange(option, 'saisons')}
        placeholder="Filtrer par saison"
        isClearable
        isMulti
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <Select
        options={joueurs}
        onChange={(option) => onFilterChange(option, 'joueurs')}
        placeholder="Filtrer par joueur"
        isClearable
        isMulti
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default FilterSection;