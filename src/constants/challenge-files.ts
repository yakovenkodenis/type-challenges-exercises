export const ChallengeFiles = {
  template: 'template.ts',
  readme: 'README.md',
  testUtils: 'test-utils.ts',
  testCases: 'test-cases.ts',
} as const;

export type ChallengeFile = typeof ChallengeFiles[keyof typeof ChallengeFiles];
