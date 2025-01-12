import type { GroupedChallengeMetadata } from '../services/challenges';
import { type Directory, Type } from './file-manager';

const makeDirectory = (name: keyof GroupedChallengeMetadata, challenges: GroupedChallengeMetadata[keyof GroupedChallengeMetadata]): Directory => ({
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
    makeDirectory('easy', challengesMetadata.easy),
    makeDirectory('medium', challengesMetadata.medium),
    makeDirectory('hard', challengesMetadata.hard),
    makeDirectory('extreme', challengesMetadata.extreme),
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
