import React from 'react';
import { Jeu } from '../../../types/Jeu';

interface BestiaireProps {
  jeu: Jeu;
}

const Bestiaire: React.FC<BestiaireProps> = ({ jeu }) => {
  return (
    <div className="bestiaire-container">
      <h2>Bestiaire de {jeu.nom}</h2>
    </div>
  );
};

export default Bestiaire;
