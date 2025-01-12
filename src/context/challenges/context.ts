import { createContext } from 'react';
import { type ChallengeMetadata, type GroupedChallengeMetadata } from '../../services/challenges';

type ChallengesContextValue = {
  challengesMetadata: ChallengeMetadata[];
  groupedChallengesMetadata: GroupedChallengeMetadata
  progress: Record<string, string>;
  isLoading: boolean;
};

export const ChallengesContext = createContext<ChallengesContextValue | undefined>(undefined);
