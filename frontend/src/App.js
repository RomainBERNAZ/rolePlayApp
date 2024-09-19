import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setupAxiosInterceptors();
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
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
          <Route path="/jeux/:id" element={<JeuxDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;