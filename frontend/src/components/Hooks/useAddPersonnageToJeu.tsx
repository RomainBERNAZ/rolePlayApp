import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import { Jeu } from '../../types/jeu';

export const useAddPersonnageToJeu = (jeuId: string, setJeu: React.Dispatch<React.SetStateAction<Jeu>>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPersonnageToJeu = async (personnageId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_BASE_URL}/jeux/${jeuId}/addPersonnage`, {
        personnageId,
      });
      const updatedJeu = response.data;
      setJeu(updatedJeu);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error adding character to game:', error);
      setError('Erreur lors de l\'ajout du personnage au jeu');
      setIsLoading(false);
      return false;
    }
  };

  return { addPersonnageToJeu, isLoading, error };
};