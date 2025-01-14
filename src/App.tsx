// Modules
import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import styled from '@emotion/styled';

// Components
import { Drawer } from './components/drawer';
import { Header } from './components/header';
import { Challenge } from './components/challenge';

// Constants
import { ChallengeFiles } from './constants/challenge-files';
import { ChallengeStatuses } from './constants/challenge-status';

// Context
import { useChallenges } from './context/challenges';
import { useCurrentChallenge } from './context/current-challenge';

// Utils
import { findFileByName } from './utils/file-manager';
import { challengeToDir } from './utils/challenge-to-dir';

// Services
import { MainFolder } from './services/challenges';
import { getChallengeFromCache } from './services/challenge-cache';

// Styles
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const { recalculateStatistics } = useChallenges();
  const { setRootDir, setSelectedFile, challengeId, setChallengeStatus } = useCurrentChallenge();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => setDrawerOpen((isOpen) => !isOpen), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const navigateToChallenge = useCallback((challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  }, [navigate]);

  const resetCurrentChallenge = useCallback(async () => {
    if (!challengeId) return;

    const path = `${MainFolder}/${challengeId}`;
    const currentChallenge = await getChallengeFromCache(path);

    const dir = challengeToDir(currentChallenge, { concatTestCases: true });

    setRootDir(dir);
    setSelectedFile(findFileByName(dir, ChallengeFiles.template));
    setChallengeStatus(ChallengeStatuses.unavailable);
    recalculateStatistics();

    closeDrawer();
  }, [challengeId, closeDrawer, recalculateStatistics, setChallengeStatus, setRootDir, setSelectedFile]);

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <Main>
        <Routes>
          <Route path="/challenge/questions/:challengeId" element={<Challenge />} />
          <Route
            path="*"
            element={<Navigate to="/challenge/questions/00004-easy-pick" replace={true} />}
          />
        </Routes>
        <Drawer
          isOpen={isDrawerOpen}
          close={closeDrawer}
          onResetChallenge={resetCurrentChallenge}
          onSelectChallenge={navigateToChallenge}
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
