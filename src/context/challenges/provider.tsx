import { useEffect, useState, type FC, type ReactNode } from 'react';
import { fetchChallenges, type Challenge } from '../../services/challenges';
import { getAllProgress } from '../../services/persistence';
import { ChallengesContext } from './context';

export const ChallengesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [fetchedChallenges, storedProgress] = await Promise.all([fetchChallenges(), getAllProgress()]);
      setChallenges(fetchedChallenges);
      setProgress(storedProgress);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <ChallengesContext.Provider value={{ challenges, progress, isLoading }}>
      {children}
    </ChallengesContext.Provider>
  );
};
