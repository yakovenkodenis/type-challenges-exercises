// Constants
import { ChallengeFiles } from '../../constants/challenge-files';
import { type DifficultyLevel, DifficultyLevels } from '../../constants/difficulty-levels';

export const MainFolder = 'questions';
const GITHUB_API_URL = `https://api.github.com/repos/type-challenges/type-challenges/contents/${MainFolder}`;

export type Challenge = {
  id: string;
  name: string;
  difficulty: DifficultyLevel;
  files: {
    template: string;
    testCases: string;
    readme: string;
  };
};

export type ChallengeMetadata = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'dir' | 'file';
  _links: string[];
};

export type GroupedChallengeMetadata = Record<Challenge['difficulty'], ChallengeMetadata[]>;

export const fetchChallengesMetadata = async (): Promise<ChallengeMetadata[]> => {
  const response = await fetch(GITHUB_API_URL);
  const challengesMetadata = await response.json();
  return challengesMetadata as ChallengeMetadata[];
};

const getFileContentUrl = (path: string, file: string) => `https://raw.githubusercontent.com/type-challenges/type-challenges/main/${path}/${file}`;

export const fetchChallenge = async (path: ChallengeMetadata['path']): Promise<Challenge> => {
  const files = [ChallengeFiles.readme, ChallengeFiles.template, ChallengeFiles.testCases];

  const [readme, template, testCases] = await Promise.all(files.map(async (file) => {
    const url = getFileContentUrl(path, file);

    try {
      const res = await fetch(url);
      return await res.text();
    } catch {
      return '';
    }
  }));

  const [, name] = path.split('/');

  return {
    id: name,
    name: name.replace(/^\d+-/, '').replace(/-/g, ' '),
    difficulty: getDifficultyFromName(name),
    files: { template, testCases, readme },
  };
}

export const getDifficultyFromName = (name: string): DifficultyLevel => {
  if (name.includes('-warm-')) return DifficultyLevels.warm;
  if (name.includes('-easy-')) return DifficultyLevels.easy;
  if (name.includes('-medium-')) return DifficultyLevels.medium;
  if (name.includes('-hard-')) return DifficultyLevels.hard;
  return DifficultyLevels.extreme;
};
