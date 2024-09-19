import React from 'react';
import { Link } from 'react-router-dom';
import Personnage from '../../types/personnage';

export const createPersonnageColumns = (players: Record<string, string>, handleRemoveCharacter: (id: string) => void) => [
    { 
        header: 'Nom', 
        accessor: (personnage: Personnage) => (
            <Link to={`/personnage/${personnage._id}`}>{personnage.nom}</Link>
        )
    },
    { header: 'Classe', accessor: 'classe' },
    { header: 'Race', accessor: 'race' },
    { header: 'Saison', accessor: (personnage: Personnage) => personnage.saison || '-' },
    { 
        header: 'Joueur', 
        accessor: (personnage: Personnage) => {
            const playerName = players[personnage.joueur] || personnage.joueur;
            return personnage.joueur ? (
                <Link to={`/joueur/${personnage.joueur}`}>{playerName}</Link>
            ) : '-';
        }
    },
    { 
        header: 'Actions', 
        accessor: (personnage: Personnage) => (
            <button onClick={() => handleRemoveCharacter(personnage._id ?? '')} className="remove-character-btn">
                Supprimer
            </button>
        )
    },
];