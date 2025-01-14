import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Directory, File } from '../../utils/file-manager';
import { type ChallengeStatus } from '../../constants/challenge-status';

type CurrentChallengeContextValue = {
  challengeId: string;
  setChallengeId: Dispatch<SetStateAction<string>>;
  
  rootDir: Directory;
  selectedFile: File | undefined;
  challengeStatus: ChallengeStatus;

  setRootDir: Dispatch<SetStateAction<Directory>>;
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
  setChallengeStatus: Dispatch<SetStateAction<ChallengeStatus>>;
};

export const CurrentChallengeContext = createContext<CurrentChallengeContextValue | undefined>(undefined);
