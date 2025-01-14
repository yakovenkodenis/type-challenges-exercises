// Modules
import { useEffect, useState, useMemo, type FC, type ReactNode, useCallback } from 'react';

// Context
import { ChallengesContext, type LinkedChallengeMetadataMap } from './context';

// Constants
import { type Level } from '../../constants/levels';

// Services
import { fetchChallengesMetadata, getDifficultyFromName, type ChallengeMetadata, type GroupedChallengeMetadata } from '../../services/challenges';
import { getAllProgress, getChallengesMetadata, saveChallengesMetadata, type ChallengeProgress } from '../../services/persistence';
import { getLevelFromProgressStatistics, getProgressStatistics } from '../../services/statistics';

// Utils
import { parseChallengeName } from '../../utils/parse-challenge-name';

const groupChallenges = (challengesMetadata: ChallengeMetadata[]): GroupedChallengeMetadata => {
  const group = Object.groupBy(challengesMetadata ?? {}, ({ name }) => getDifficultyFromName(name));

  group.warm ??= [];
  group.easy ??= [];
  group.medium ??= [];
  group.hard ??= [];
  group.extreme ??= [];

  return group as GroupedChallengeMetadata;
};

const getSortedChallengesMetadataMap = (challengesMetadata: ChallengeMetadata[]): LinkedChallengeMetadataMap => {
  return challengesMetadata
    .toSorted((a, b) => {
      const aParsed = parseChallengeName(a.name);
      const bParsed = parseChallengeName(b.name);

      // First, compare by difficulty level
      if (aParsed.difficultyIndex !== bParsed.difficultyIndex) {
        return aParsed.difficultyIndex - bParsed.difficultyIndex;
      }

      // If difficulty is the same, compare by number
      return aParsed.number - bParsed.number;
    })
    .reduce<LinkedChallengeMetadataMap>((map, metadata, idx, array) => {
      map[metadata.name] = {
        ...metadata,
        next: array.at(idx + 1)?.name,
      };
      return map;
    }, {});
}

const EMPTY_ARRAY: ChallengeMetadata[] = [];

export const ChallengesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [challengesMetadata, setChallengesMetadata] = useState<ChallengeMetadata[]>(EMPTY_ARRAY);
  const [progress, setProgress] = useState<Record<string, ChallengeProgress | null>>({});
  const [level, setLevel] = useState<Level>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      let challengesMetadata = await getChallengesMetadata();
      if (!challengesMetadata) {
        challengesMetadata = await fetchChallengesMetadata();
        await saveChallengesMetadata(challengesMetadata);
      }

      const userProgress = await getAllProgress();

      setChallengesMetadata(challengesMetadata);
      setProgress(userProgress);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const recalculateStatistics = useCallback(async () => {
    const userProgress = await getAllProgress();
    setProgress(userProgress);
  }, []);

  useEffect(() => {
    const progressStatistics = getProgressStatistics(progress);
    const level = getLevelFromProgressStatistics(progressStatistics);
    setLevel(level);
  }, [progress]);

  const value = useMemo(() => ({
    challengesMetadata,
    challengesMetadataLinkedMap: getSortedChallengesMetadataMap(challengesMetadata),
    groupedChallengesMetadata: groupChallenges(challengesMetadata),
    progress,
    isLoading,
    level,
    setLevel,
    progressStatistics: getProgressStatistics(progress),
    recalculateStatistics,
  }), [challengesMetadata, isLoading, progress, level, recalculateStatistics]);

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};
