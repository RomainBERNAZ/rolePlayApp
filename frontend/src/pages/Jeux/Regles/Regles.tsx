import React from 'react';
import { Jeu } from '../../../types/Jeu';

interface ReglesProps {
  jeu: Jeu;
}

const Regles: React.FC<ReglesProps> = ({ jeu }) => {
  return (
    <div className="regles-container">
      <h2>Regles de {jeu.nom}</h2>
    </div>
  );
};

export default Regles;
