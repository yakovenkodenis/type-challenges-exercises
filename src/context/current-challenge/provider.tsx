import { useState, useMemo, type FC, type ReactNode } from 'react';
import { CurrentChallengeContext } from './context';
import { Type, type Directory, type File } from '../../utils/file-manager';
import { ChallengeStatuses, type ChallengeStatus } from '../../constants/challenge-status';

const dummyDir: Directory = {
  id: '1',
  name: 'loading...',
  type: Type.DUMMY,
  parentId: undefined,
  depth: 0,
  dirs: [],
  files: [],
};

export const CurrentChallengeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [rootDir, setRootDir] = useState<Directory>(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [challengeId, setChallengeId] = useState<string>('');
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus>(ChallengeStatuses.unavailable);

  const value = useMemo(() => ({
    rootDir,
    setRootDir,

    challengeId,
    setChallengeId,

    challengeStatus,
    setChallengeStatus,

    selectedFile,
    setSelectedFile,
  }), [challengeId, challengeStatus, rootDir, selectedFile]);

  return (
    <CurrentChallengeContext.Provider value={value}>
      {children}
    </CurrentChallengeContext.Provider>
  );
};
