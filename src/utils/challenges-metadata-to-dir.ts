import type { GroupedChallengeMetadata } from '../services/challenges';
import { type Directory, Type } from './file-manager';
import { type DifficultyLevel, DifficultyLevels } from '../constants/difficulty-levels';

const makeDirectory = (name: DifficultyLevel, challenges: GroupedChallengeMetadata[DifficultyLevel]): Directory => ({
  name,
  id: name,
  parentId: '0',
  type: Type.DIRECTORY,
  depth: 1,
  dirs: [],
  files: challenges.map((challenge) => ({
    depth: 2,
    id: challenge.path,
    name: challenge.name,
    parentId: name,
    type: Type.FILE,
    content: '',
  })),
});

export const challengesMetadataToDir = (challengesMetadata: GroupedChallengeMetadata): Directory => {
  const dirs = [
    makeDirectory(DifficultyLevels.warm, challengesMetadata.warm),
    makeDirectory(DifficultyLevels.easy, challengesMetadata.easy),
    makeDirectory(DifficultyLevels.medium, challengesMetadata.medium),
    makeDirectory(DifficultyLevels.hard, challengesMetadata.hard),
    makeDirectory(DifficultyLevels.extreme, challengesMetadata.extreme),
  ];

  return {
    depth: 0,
    type: Type.DIRECTORY,
    id: '0',
    name: 'root',
    parentId: undefined,
    files: [],
    dirs,
  };
};
