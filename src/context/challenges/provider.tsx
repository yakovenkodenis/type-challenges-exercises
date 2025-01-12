import { useEffect, useState, useMemo, type FC, type ReactNode } from 'react';
import { fetchChallengesMetadata, getDifficultyFromName, type ChallengeMetadata, type GroupedChallengeMetadata } from '../../services/challenges';
import { getAllProgress, getChallengesMetadata, saveChallengesMetadata } from '../../services/persistence';
import { ChallengesContext } from './context';

const groupChallenges = (challengesMetadata: ChallengeMetadata[]): GroupedChallengeMetadata => {
  const group = Object.groupBy(challengesMetadata ?? {}, ({ name }) => getDifficultyFromName(name));

  group.easy ??= [];
  group.medium ??= [];
  group.hard ??= [];
  group.extreme ??= [];

  return group as GroupedChallengeMetadata;
}

const EMPTY_ARRAY: ChallengeMetadata[] = [];

export const ChallengesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [challengesMetadata, setChallengesMetadata] = useState<ChallengeMetadata[]>(EMPTY_ARRAY);
  const [progress, setProgress] = useState<Record<string, string>>({});
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

      // Apply saved progress to the challenges
      // challengesMetadata.forEach((challenge) => {
      //   if (userProgress[challenge.id]) {
      //     challenge.content = userProgress[challenge.id]; // Overwrite with saved content
      //   }
      // });

      setChallengesMetadata(challengesMetadata);
      setProgress(userProgress);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const value = useMemo(() => ({
    challengesMetadata,
    groupedChallengesMetadata: groupChallenges(challengesMetadata),
    progress,
    isLoading
  }), [challengesMetadata, isLoading, progress]);

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};
