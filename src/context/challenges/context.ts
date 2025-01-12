import { createContext } from 'react';
import { type Challenge } from '../../services/challenges';

type ChallengesContextValue = {
  challenges: Challenge[];
  progress: Record<string, string>;
  isLoading: boolean;
};

export const ChallengesContext = createContext<ChallengesContextValue | undefined>(undefined);
