export const ChallengeStatuses = {
  success: 'success',
  error: 'error',
  unavailable: 'unavailable',
} as const;

export type ChallengeStatus = typeof ChallengeStatuses[keyof typeof ChallengeStatuses];
