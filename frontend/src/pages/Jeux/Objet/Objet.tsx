import React from 'react';
import { Jeu } from '../../../types/Jeu';

interface ObjetProps {
  jeu: Jeu;
}

const Objet: React.FC<ObjetProps> = ({ jeu }) => {
  return (
    <div className="objets-container">
      <h2>Objets de {jeu.nom}</h2>
    </div>
  );
};

export default Objet;