import React, { useState, useEffect, useContext } from 'react';
import { Jeu } from '../../../types/jeu';
import axios from 'axios';
import { Classe } from '../../../types/classe';
import { API_URL } from '../../../utils/constants';
import Modal from '../../../components/Modal/Modal.tsx';
import Table from '../../../components/Table/Table.tsx';
import { UserContext } from '../../../contexts/UserContext.tsx';

interface ClasseProps {
  jeu: Jeu;
}

const ClasseComponent: React.FC<ClasseProps> = ({ jeu }) => {
  const userContext = useContext(UserContext);
  const isAdmin = userContext?.isAdmin || false;
  const [classes, setClasses] = useState<Classe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nouvelleClasse, setNouvelleClasse] = useState({
    nom: '',
    description: '',
  });

  const fetchClasses = async (jeuId: string) => {
    try {
      const response = await axios.get<Classe[]>(
        `${API_URL}/classes/jeu/${jeuId}`
      );
      setClasses(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      setClasses([]); // Ensure classes are reset on error
    }
  };

  useEffect(() => {
    fetchClasses(jeu._id);
  }, [jeu._id]);

  const ouvrirModal = () => {
    setIsModalOpen(true);
  };

  const fermerModal = () => {
    setIsModalOpen(false);
    setNouvelleClasse({ nom: '', description: '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNouvelleClasse({ ...nouvelleClasse, [name]: value });
  };

  const ajouterClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const classeACreer = {
        ...nouvelleClasse,
        jeu: jeu._id,
      };
      const response = await axios.post(`${API_URL}/classes`, classeACreer);
      setClasses([...classes, response.data]);
      fermerModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la classe:", error);
    }
  };

  const supprimerClasse = async (classeId: string) => {
    try {
      await axios.delete(`${API_URL}/classes/${classeId}`);
      setClasses(classes.filter((classe) => classe._id !== classeId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
    }
  };

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Description', accessor: 'description' },
    ...(isAdmin
      ? [
          {
            header: 'Actions',
            accessor: (classe: Classe) => (
              <button onClick={() => supprimerClasse(classe._id)}>
                Supprimer
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="classes-container">
      <h2>Classes de {jeu.nom}</h2>
      {isAdmin && (
        <button onClick={ouvrirModal}>Ajouter une nouvelle classe</button>
      )}

      <Table data={classes} columns={columns} />

      {isAdmin && (
        <Modal isOpen={isModalOpen} onClose={fermerModal}>
          <h3>Ajouter une nouvelle classe</h3>
          <form onSubmit={ajouterClasse}>
            <div>
              <label htmlFor="nom">Nom:</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={nouvelleClasse.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={nouvelleClasse.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Ajouter</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ClasseComponent;
