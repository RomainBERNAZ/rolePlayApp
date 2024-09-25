import React, { useState, useEffect } from 'react';
import { Jeu } from '../../../types/jeu';
import axios from 'axios';
import { Classe } from '../../../types/classe';     
import { API_URL } from '../../../utils/constants';   

interface ClasseProps {
  jeu: Jeu;
}

const ClasseComponent: React.FC<ClasseProps> = ({ jeu }) => {

    const [classes, setClasses] = useState<Classe[]>([]);

    const fetchClasses = async (jeuId: string) => {
        try {
          const response = await axios.get<Classe[]>(`${API_URL}/classes/jeu/${jeuId}`);
          setClasses(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des classes:', error);
          setClasses([]); // Ensure classes are reset on error
        }
      };

    useEffect(() => {
        fetchClasses(jeu._id); 
    }, [jeu._id]); 

    return (
        <div className="classes-container">
            <h2>Classes de {jeu.nom}</h2>
            <ul>
                {jeu.classes.map((classe) => (
                    <li key={classe._id}>{classe.nom}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClasseComponent;
