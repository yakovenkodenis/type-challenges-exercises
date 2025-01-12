import localForage from 'localforage';
import type { ChallengeMetadata, Challenge } from '../challenges';

const progressDb = localForage.createInstance({
  name: 'type-challenges',
  storeName: 'progress',
});

const initialDataDb = localForage.createInstance({
  name: 'type-challenges',
  storeName: 'initial-data',
});

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

export const saveChallengeProgress = async (challengeId: string, content: string) => {
  await progressDb.setItem(challengeId, content);
};

export const getChallengeProgress = async (challengeId: string): Promise<string | null> => {
  return await progressDb.getItem<string>(challengeId);
};

export const getAllProgress = async (): Promise<Record<string, string>> => {
  const keys = await progressDb.keys();
  const progress: Record<string, string> = {};

  for (const key of keys) {
    progress[key] = (await progressDb.getItem<string>(key)) || '';
  }

  return progress;
};
