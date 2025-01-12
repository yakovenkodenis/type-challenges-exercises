import localForage from 'localforage';

const progressDb = localForage.createInstance({
  name: 'type-challenges',
  storeName: 'progress',
});

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
