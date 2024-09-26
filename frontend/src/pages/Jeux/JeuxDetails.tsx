import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu/SubMenu.tsx';
import PersonnageJeu from './PersonnageJeu/PersonnageJeu.tsx';
import Bestiaire from './Bestiaire/Bestiaire.tsx';
import './JeuxDetails.css';
import { API_URL } from '../../utils/constants';
import Accueil from './Accueil/Accueil.tsx';
import Regles from './Regles/Regles.tsx';
import Saison from './Saison/Saison.tsx';
import Objet from './Objet/Objet.tsx';
import ClasseComponent from './Classe/Classe.tsx';

const JeuxDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [jeu, setJeu] = useState<any>(null); // Initialiser jeu à null
  const [activeId, setActiveId] = useState('accueil');
  const [isLoading, setIsLoading] = useState(true); // Toujours commencer avec isLoading à true

  useEffect(() => {
    const fetchJeuDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/jeux/${id}`);
        setJeu(response.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des détails du jeu:',
          error
        );
        // Optionnellement, rediriger vers une page d'erreur ou afficher un message d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    fetchJeuDetails();
  }, [id]);

  // Vérifier si jeu est null avant d'accéder à _id
  const _id = jeu?._id;

  const renderContent = useMemo(() => {
    const commonProps = { jeuId: _id, jeu, setJeu };
    if (isLoading || !jeu) {
      return <div>Chargement...</div>;
    }

    switch (activeId) {
      case 'accueil':
        return <Accueil key={_id} {...commonProps} />;
      case 'regles':
        return <Regles key={_id} {...commonProps} />;
      case 'personnages':
        return <PersonnageJeu key={_id} {...commonProps} />;
      case 'bestiaire':
        return <Bestiaire key={_id} {...commonProps} />;
      case 'objets':
        return <Objet key={_id} {...commonProps} />;
      case 'saisons':
        return <Saison key={_id} {...commonProps} />;
      case 'classes':
        return <ClasseComponent key={_id} {...commonProps} />;
      default:
        return <div>Contenu de l'accueil</div>;
    }
  }, [_id, jeu, setJeu, isLoading, activeId]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Vérifier si jeu existe avant d'accéder à ses propriétés
  if (!jeu) {
    return <div>Erreur : Impossible de charger les détails du jeu.</div>;
  }

  const subMenuItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'regles', label: 'Règles' },
    { id: 'saisons', label: 'Saisons' },
    { id: 'personnages', label: 'Personnages' },
    { id: 'classes', label: 'Classes' },
    { id: 'bestiaire', label: 'Bestiaire' },
    { id: 'objets', label: 'Objets' },
  ];

  return (
    <div className="jeu-details-container">
      <h1>{jeu?.nom}</h1>
      <div className="submenu-container">
        <SubMenu
          items={subMenuItems}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </div>

      {renderContent}

      <Link to="/jeux" className="back-link">
        Retour à la liste des jeux
      </Link>
    </div>
  );
};

export default JeuxDetails;
