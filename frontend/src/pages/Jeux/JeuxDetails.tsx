import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu/SubMenu.tsx';
import PersonnageJeu from './PersonnageJeu/PersonnageJeu.tsx';
import Bestiaire from './Bestiaire/Bestiaire.tsx';
import './JeuxDetails.css';
import { API_URL } from '../../utils/constants';

const JeuxDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [jeu, setJeu] = useState(location.state?.jeu);
  const [activeId, setActiveId] = useState('accueil');
  const [isLoading, setIsLoading] = useState(!location.state?.jeu);


  useEffect(() => {
    const fetchJeuDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/jeux/${id}`);
        setJeu(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
        // Optionally, redirect to an error page or show an error message
      } finally {
        setIsLoading(false);
      }
    };

    if (!jeu) {
      fetchJeuDetails();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const renderContent = useMemo(() => {
    if (isLoading || !jeu) {
      return <div>Loading...</div>;
    }

    switch (activeId) {
      case 'personnages':
        return <PersonnageJeu key={jeu._id} jeuId={jeu._id} jeu={jeu} setJeu={setJeu} />;
      case 'bestiaire':
        return <Bestiaire key={jeu._id} jeuId={jeu._id} jeu={jeu} setJeu={setJeu} />;
      default:
        return <div>Contenu de l'accueil</div>;
    }
  }, [activeId, jeu, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const subMenuItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'regles', label: 'Règles' },
    { id: 'saisons', label: 'Saisons' },
    { id: 'personnages', label: 'Personnages' },
    { id: 'classes', label: 'Classes'},
    { id: 'bestiaire', label: 'Bestiaire'},
    { id: 'objets', label: 'Objets'},
  ];

  return (
    <div className="jeu-details-container">
      <h1>{jeu?.nom}</h1>
      <SubMenu items={subMenuItems} activeId={activeId} setActiveId={setActiveId} />
      
      {renderContent}

      <Link to="/jeux" className="back-link">Retour à la liste des jeux</Link>
    </div>
  );
};

export default JeuxDetails;
