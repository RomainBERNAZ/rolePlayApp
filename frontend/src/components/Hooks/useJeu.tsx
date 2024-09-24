import { useState, useEffect } from 'react';
import axios from 'axios';
import { Jeu } from '../../types/jeu';
import { API_URL } from '../../utils/constants';

export const useJeu = () => {
  const [games, setGames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<Jeu[]>(`${API_URL}/jeux`);
        const gamesMap = response.data.reduce((acc, game) => {
          acc[game._id] = game.nom;
          return acc;
          
        }, {} as Record<string, string>);
        setGames(gamesMap);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return games;
};