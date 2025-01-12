// Modules
import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Drawer } from './components/drawer';
import { Header } from './components/header';
import { Challenge } from './components/challenge';

// Utils
import { typeChallenges } from './utils/tmp-tree';

// Styles
import './App.css';

const App = () => {
  const navigate = useNavigate();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const navigateToChallenge = useCallback((challengeId: string | number) => {
    navigate(`/challenge/${Number(challengeId) + 1}`);
  }, [navigate]);

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <Main>
        <Routes>
          <Route path="/challenge/:challengeId" element={<Challenge />} />
          <Route
            path="*"
            element={<Navigate to="/challenge/1" replace={true} />}
          />
        </Routes>
        <Drawer
          isOpen={isDrawerOpen}
          close={closeDrawer}
          challenges={typeChallenges}
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
