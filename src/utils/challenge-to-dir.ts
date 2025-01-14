// Assets
import testUtilsContentString from '../assets/test-utils?raw';

// Constants
import { ChallengeFiles } from '../constants/challenge-files';


import type { Challenge } from '../services/challenges';
import { type Directory, type File, Type } from './file-manager';

type MakeFileOptions = {
  name: string;
  parentId: string;
  content: string;
  depth: number;
};

const makeFile = ({ name, parentId, content, depth }: MakeFileOptions): File => {
  return {
    id: name,
    parentId,
    name,
    content,
    depth,
    type: Type.FILE,
  }
};

const combine = (template: string, testCases: string): string => {
  return `
${template}

// ========== TEST CASES (do not edit) ==========
${testCases}
`.trimStart();
};

type ChangeToDirOptions = {
  concatTestCases?: boolean;
};

export const challengeToDir = (challenge: Challenge, options?: ChangeToDirOptions): Directory => {
  const { concatTestCases = true } = options ?? {};

  const {
    id,
    name,
    files,
  } = challenge;

  const { readme, template, testCases } = files;

  return {
    depth: 0,
    type: Type.DIRECTORY,
    id: '0',
    name: 'root',
    parentId: undefined,
    files: [],
    dirs: [{
      id,
      name,
      parentId: '0',
      type: Type.DIRECTORY,
      depth: 1,
      dirs: [],
      files: [
        makeFile({ name: ChallengeFiles.readme, content: readme, depth: 2, parentId: id }),
        makeFile({ name: ChallengeFiles.template, content: concatTestCases ? combine(template, testCases) : template, depth: 2, parentId: id }),
        makeFile({ name: ChallengeFiles.testUtils, content: testUtilsContentString, depth: 2, parentId: id }),
      ],
    }]
  }
};
