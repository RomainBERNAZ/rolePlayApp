import { useState, useEffect } from 'react';
import axios from 'axios';
import Personnage from '../../types/personnage';
import { API_BASE_URL } from '../../utils/constants';

export const usePersonnages = () => {
  const [allCharacters, setAllCharacters] = useState<Personnage[]>([]);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const response = await axios.get<Personnage[]>(`${API_BASE_URL}/personnages`);
        setAllCharacters(response.data);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setAllCharacters([]);
      }
    };

    fetchAllCharacters();
  }, []);

  return allCharacters;
};