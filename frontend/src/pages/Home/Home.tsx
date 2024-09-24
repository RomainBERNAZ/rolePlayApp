import React from 'react';
import Login from '../../components/Login/Login.tsx';
import './Home.css';

interface HomeProps {
  onLogin: (token: string) => void;
  isLoggedIn: boolean; // Ajoutez cette prop
}

const Home: React.FC<HomeProps> = ({ onLogin, isLoggedIn }) => {
  return (
    <div className="home">
      {isLoggedIn ? (
        <div className="prequel">
          <h1>Bienvenue dans RPAPP : Le Jeu de Rôle des Origines</h1>
          <section className="game-description">
            <p>Plongez dans les histoires d'origine de personnages légendaires. Explorez les événements qui ont façonné les héros et les vilains avant qu'ils ne deviennent célèbres.</p>
            
            <h2>Caractéristiques du jeu</h2>
            <ul>
              <li>Création de personnage basée sur des archétypes</li>
              <li>Mécanique de destin unique</li>
              <li>Points de tournant qui altèrent le parcours du personnage</li>
              <li>Multiples univers : fantasy, science-fiction, historique</li>
              <li>Narration inversée : connaissez la fin, découvrez le début</li>
            </ul>

            <h2>Scénarios types</h2>
            <ol>
              <li>L'apprentissage d'un jeune mage</li>
              <li>Les premières missions d'un futur agent secret</li>
              <li>L'ascension d'un politicien ambitieux</li>
            </ol>
          </section>
        </div>
      ) : (
        <Login onLogin={onLogin} />
      )}
    </div>
  );
};

export default Home;