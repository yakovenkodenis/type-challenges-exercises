import localForage from 'localforage';
import type { ChallengeMetadata, Challenge } from '../challenges';

const dbName = 'type-challenges';

const progressDb = localForage.createInstance({
  name: dbName,
  storeName: 'progress',
});

const initialDataDb = localForage.createInstance({
  name: dbName,
  storeName: 'initial-data',
});

export interface ChallengeProgress {
  content: string;
  completed: boolean;
}

export const saveChallengesMetadata = async (challengesMetadata: ChallengeMetadata[]) => {
  await initialDataDb.setItem('challenges-metadata', challengesMetadata);
}

export const getChallengesMetadata = async (): Promise<ChallengeMetadata[] | null> => {
  return await initialDataDb.getItem<ChallengeMetadata[]>('challenges-metadata');
}

export const saveChallenge = async (challenge: Challenge) => {
  await initialDataDb.setItem(challenge.id, challenge);
}

export const getChallenge = async (id: Challenge['id']): Promise<Challenge | null> => {
  return await initialDataDb.getItem<Challenge>(id);
}

export const saveChallengeProgress = async (challengeId: string, challenge: ChallengeProgress) => {
  await progressDb.setItem(challengeId, challenge);
};

export const getChallengeProgress = async (challengeId: string): Promise<ChallengeProgress | null> => {
  return await progressDb.getItem<ChallengeProgress>(challengeId);
};

export const getAllProgress = async (): Promise<Record<string, ChallengeProgress | null>> => {
  const keys = await progressDb.keys();
  const progress: Record<string, ChallengeProgress | null> = {};

  for (const key of keys) {
    progress[key] = (await progressDb.getItem<ChallengeProgress>(key)) || null;
  }

  return progress;
};
