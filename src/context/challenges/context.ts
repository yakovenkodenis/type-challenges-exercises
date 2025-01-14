import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type ChallengeMetadata, type GroupedChallengeMetadata } from '../../services/challenges';
import { type ChallengeProgress } from '../../services/persistence';
import type { ProgressStatistics } from '../../services/statistics';
import type { Level } from '../../constants/levels';

export interface LinkedChallengeMetadata extends ChallengeMetadata {
  next?: ChallengeMetadata['name'];
}

export type LinkedChallengeMetadataMap = Record<ChallengeMetadata['name'], LinkedChallengeMetadata>;

type ChallengesContextValue = {
  challengesMetadata: ChallengeMetadata[];
  challengesMetadataLinkedMap: LinkedChallengeMetadataMap;
  groupedChallengesMetadata: GroupedChallengeMetadata
  progress: Record<string, ChallengeProgress | null>;
  progressStatistics: ProgressStatistics;
  isLoading: boolean;
  level: Level | undefined;
  setLevel: Dispatch<SetStateAction<Level | undefined>>;
  recalculateStatistics: () => Promise<void>;
};

export const ChallengesContext = createContext<ChallengesContextValue | undefined>(undefined);
