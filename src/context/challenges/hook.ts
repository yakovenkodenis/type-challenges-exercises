import { useContext } from 'react';
import { ChallengesContext } from './context';

export const useChallenges = () => {
  const context = useContext(ChallengesContext);

  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }

  return context;
};
