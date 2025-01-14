import { useContext } from 'react';
import { CurrentChallengeContext } from './context';

export const useCurrentChallenge = () => {
  const context = useContext(CurrentChallengeContext);

  if (!context) {
    throw new Error('useCurrentChallenge must be used within a CurrentChallengeProvider');
  }

  return context;
};
