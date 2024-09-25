import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import Personnage from './pages/Personnage/Personnage.tsx';
import PersonnageDetail from './pages/Personnage/PersonnageDetail.tsx';
import Menu from './components/Menu/Menu.tsx';
import setupAxiosInterceptors from './utils/axiosInterceptor.tsx';
import Joueur from './pages/Joueur/Joueur.tsx';
import JoueurDetail from './pages/Joueur/JoueurDetails.tsx';
import Jeux from './pages/Jeux/Jeux.tsx';
import JeuxDetails from './pages/Jeux/JeuxDetails.tsx';
import PersonnageJeu from './pages/Jeux/PersonnageJeu/PersonnageJeu.tsx'

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ajoute l'état de chargement

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setupAxiosInterceptors();
    }
    setIsLoading(false); // Quand la vérification est terminée
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', user.role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      }).catch((error) => {
        console.error('Échec de l\'enregistrement du Service Worker:', error);
      });
    });
  }

  // Ne pas afficher les routes tant que la vérification n'est pas terminée
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <UserProvider>
      <Router>
        <div className="app">
          {isLoggedIn && <Menu onLogout={handleLogout} />}
          <Routes>
            <Route path="/" element={<Home onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
            <Route path="/personnages" element={
              isLoggedIn ? <Personnage /> : <Navigate to="/" />
            } />
            <Route path="/joueurs" element={
              isLoggedIn ? <Joueur /> : <Navigate to="/" />
            } />
            <Route path="/joueur/:id" element={
              isLoggedIn ? <JoueurDetail /> : <Navigate to="/" />
            } />
            <Route path="/jeux/:id/personnages" element={
              isLoggedIn ? <PersonnageJeu/> : <Navigate to="/" />
            } />
            <Route path="/personnage/:id" element={
              isLoggedIn ? <PersonnageDetail /> : <Navigate to="/" />
            } />
            <Route path="/jeux" element={
              isLoggedIn ? <Jeux /> : <Navigate to="/" />
            } />
            <Route path="/jeux/:id" element={
              isLoggedIn ? <JeuxDetails /> : <Navigate to="/" />
            } />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
