import React from 'react';
import { Jeu } from '../../../types/Jeu';

interface SaisonProps {
  jeu: Jeu;
}

const Saison: React.FC<SaisonProps> = ({ jeu }) => {
  return (
    <div className="saisons-container">
      <h2>Saisons de {jeu.nom}</h2>
    </div>
  );
};

export default Saison;