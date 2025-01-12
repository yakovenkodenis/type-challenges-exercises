// Modules
import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Drawer } from './components/drawer';
import { Header } from './components/header';
import { Challenge } from './components/challenge';

// Styles
import './App.css';

const App = () => {
  const navigate = useNavigate();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const navigateToChallenge = useCallback((challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  }, [navigate]);

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <Main>
        <Routes>
          <Route path="/challenge/:folder/:challengeId" element={<Challenge />} />
          <Route
            path="*"
            element={<Navigate to="/challenge/questions/00002-medium-return-type" replace={true} />}
          />
        </Routes>
        <Drawer
          isOpen={isDrawerOpen}
          close={closeDrawer}
          onLogin={() => { console.log('login') }}
          onLogout={() => { console.log('logout') }}
          onSelectChallenge={navigateToChallenge}
          user={{ email: 'email@example.org', avatar: 'https://i.pravatar.cc/300' }}
        />
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
  height: 100vh;
`;

export default App;
