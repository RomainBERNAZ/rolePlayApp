import React, { useState, useContext } from 'react';
import axios from 'axios';
import Table from '../../../components/Table/Table.tsx';
import Modal from '../../../components/Modal/Modal.tsx';
import { Jeu } from '../../../types/jeu';
import { usePersonnages } from '../../../components/Hooks/usePersonnages.tsx';
import { useJoueurs } from '../../../components/Hooks/useJoueurs.tsx';
import { API_URL } from '../../../utils/constants';
import { useAddPersonnageToJeu } from '../../../components/Hooks/useAddPersonnageToJeu.tsx';
import { createPersonnageColumns } from '../../../components/Table/personnageColumns.tsx';
import { UserContext } from '../../../contexts/UserContext.tsx';

interface PersonnageJeuProps {
  jeuId: string;
  jeu: Jeu;
  setJeu: React.Dispatch<React.SetStateAction<Jeu>>;
}

const PersonnageJeu: React.FC<PersonnageJeuProps> = ({
  jeuId,
  jeu,
  setJeu,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const allCharacters = usePersonnages();
  const players = useJoueurs();
  const { addPersonnageToJeu, isLoading, error } = useAddPersonnageToJeu(
    jeuId,
    setJeu
  );
  const { isAdmin } = useContext(UserContext) || {};
  const handleAddCharacter = () => {
    setShowModal(true);
  };

  console.log(jeu);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCharacter('');
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharacter(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedCharacter) {
      const success = await addPersonnageToJeu(selectedCharacter);
      if (success) {
        handleCloseModal();
      }
    }
  };

  const handleRemoveCharacter = async (personnageId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/jeux/${jeuId}/removePersonnage/${personnageId}`
      );
      const updatedJeu = response.data;
      setJeu(updatedJeu);
    } catch (error) {
      console.error('Error removing character from game:', error);
    }
  };

  const characterColumns = createPersonnageColumns(
    players,
    handleRemoveCharacter
  );
  return (
    <div className="characters-container">
      <h2>Personnages de {jeu.nom}</h2>
      {isAdmin && (
        <button onClick={handleAddCharacter} className="add-character-btn">
          Ajouter un personnage existant
        </button>
      )}
      {jeu.personnages && jeu.personnages.length > 0 ? (
        <Table
          data={jeu.personnages}
          columns={characterColumns}
          className="characters-table"
        />
      ) : (
        <p>Aucun personnage n'est associé à ce jeu.</p>
      )}
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <h3>Ajouter un personnage existant</h3>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <select
              value={selectedCharacter}
              onChange={handleSelectChange}
              required
            >
              <option value="">Sélectionnez un personnage</option>
              {allCharacters
                .filter(
                  (char) =>
                    !jeu.personnages.some(
                      (gameChar) => gameChar._id === char._id
                    )
                )
                .map((char) => (
                  <option key={char._id} value={char._id}>
                    {char.nom}
                  </option>
                ))}
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PersonnageJeu;
