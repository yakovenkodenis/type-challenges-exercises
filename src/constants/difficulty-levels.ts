export const DifficultyLevels = {
  warm: 'warm',
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
  extreme: 'extreme',
} as const;

export type DifficultyLevel = typeof DifficultyLevels[keyof typeof DifficultyLevels];

export const difficultyOrder = [
  DifficultyLevels.warm,
  DifficultyLevels.easy,
  DifficultyLevels.medium,
  DifficultyLevels.hard,
  DifficultyLevels.extreme,
] as const;
