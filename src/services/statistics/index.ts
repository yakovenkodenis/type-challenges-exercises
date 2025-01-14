import { type ChallengeProgress } from '../persistence';
import { DifficultyLevels, type DifficultyLevel } from '../../constants/difficulty-levels';
import { Levels, type Level } from '../../constants/levels';
import { parseChallengeName } from '../../utils/parse-challenge-name';

export type ProgressStatistics = Record<DifficultyLevel, number>;

export const getProgressStatistics = (progress: Record<string, ChallengeProgress | null>): ProgressStatistics => {
  const userProgress = {
    [DifficultyLevels.warm]: 0,
    [DifficultyLevels.easy]: 0,
    [DifficultyLevels.medium]: 0,
    [DifficultyLevels.hard]: 0,
    [DifficultyLevels.extreme]: 0,
  };

  for (const challengeName of Object.keys(progress)) {
    const { difficulty } = parseChallengeName(challengeName);

    if (difficulty && progress[challengeName]?.completed) {
      userProgress[difficulty] += 1;
    }
  }

  return userProgress;
};

export const getLevelFromProgressStatistics = (statistics: ProgressStatistics): Level => {
  switch (true) {
    case statistics.extreme >= 10: return Levels.wizard;
    case statistics.hard >= 5 && statistics.extreme >= 1: return Levels.master;
    case statistics.medium >= 10 && statistics.hard >= 3: return Levels.expert;
    case statistics.medium >= 5: return Levels.specialist;
    case statistics.easy >= 10: return Levels.apprentice;
    default: return Levels.explorer;
  }
};
