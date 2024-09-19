import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Personnage from '../../types/personnage';



interface AddPlayerFormProps {
  jeuId: string;
  onAddPlayer: (playerId: string) => void;
  joueursInscrits: string[];
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ jeuId, onAddPlayer, joueursInscrits }) => {
  const [players, setPlayers] = useState<Personnage[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/personnages');
        const allPlayers = response.data;
        console.log(allPlayers);
        // Filtrer les joueurs qui ne sont pas déjà inscrits
        const availablePlayers = allPlayers.filter(player => !joueursInscrits.includes(player._id));
        setPlayers(availablePlayers);
      } catch (error) {
        console.error("Erreur lors de la récupération des joueurs", error);
      }
    };

    fetchPlayers();
  }, [joueursInscrits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer) {
      onAddPlayer(selectedPlayer);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        <option value="">Sélectionner un joueur</option>
        {players.map((player) => (
          <option key={player._id} value={player._id}>
           {player.nom}
          </option>
        ))}
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddPlayerForm;