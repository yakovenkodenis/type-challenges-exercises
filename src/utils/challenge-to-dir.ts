// Assets
import testUtilsContentString from '../assets/test-utils?raw';

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
  `;
};

export const challengeToDir = (challenge: Challenge): Directory => {
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
        makeFile({ name: 'README.md', content: readme, depth: 2, parentId: id }),
        makeFile({ name: 'template.ts', content: combine(template, testCases), depth: 2, parentId: id }),
        makeFile({ name: 'test-utils.ts', content: testUtilsContentString, depth: 2, parentId: id }),
      ],
    }]
  }
};
