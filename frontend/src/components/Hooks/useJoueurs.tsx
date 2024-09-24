import { useState, useEffect } from 'react';
import axios from 'axios';
import Joueur from '../../types/joueur';
import { API_URL } from '../../utils/constants';

export const useJoueurs = () => {
  const [players, setPlayers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get<Joueur[]>(`${API_URL}/joueurs`);
        const playersMap = response.data.reduce((acc, player) => {
          acc[player._id] = player.nom;
          return acc;
          
        }, {} as Record<string, string>);
        setPlayers(playersMap);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);
  return players;
};