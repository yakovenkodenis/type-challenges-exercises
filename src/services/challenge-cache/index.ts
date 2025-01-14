// Services
import { fetchChallenge } from '../challenges';
import { getChallenge, saveChallenge } from '../persistence';

export async function getChallengeFromCache(challengeId: string) {
  let challenge = await getChallenge(challengeId);

  if (!challenge) {
    challenge = await fetchChallenge(challengeId);
    await saveChallenge(challenge);
  }

  return challenge;
}
