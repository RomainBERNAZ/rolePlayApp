import React from 'react';
import { Link } from 'react-router-dom';
import { Personnage } from '../../types/personnage.tsx';

interface PersonnageListProps {
  personnages: Personnage[];
  onDelete: (id: string) => Promise<void>;
}

const PersonnageList: React.FC<PersonnageListProps> = ({ personnages, onDelete }) => {
  const handleDelete = async (id: string) => {
    await onDelete(id);
    // La suppression aura un effet sur les filtres car la liste des personnages sera mise à jour
  };

  return (
    <table className="personnage-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Classe</th>
          <th>Race</th>
          <th>Jeu</th>
          <th>Saison</th>
        </tr>
      </thead>
      <tbody>
        {personnages.map((personnage, index) => (
          <tr key={personnage._id || `personnage-${index}`}>
            <td>
              <Link to={`/personnage/${personnage._id}`}>{personnage.nom}</Link>
            </td>
            <td>{personnage.classe}</td>
            <td>{personnage.race}</td>
            <td>
              {personnage.participations?.map((participation, index) => (
                <p key={index}>
                  <Link to={`/jeux/${participation.jeu._id}`}>{participation.jeu.nom}</Link>
                </p>
              )) || 'Aucune participation'}
            </td>
            <td>{personnage.saison}</td>
            <td>
              <button onClick={() => handleDelete(personnage._id || '')}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PersonnageList;