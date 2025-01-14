import { FaBinoculars, FaHatWizard, FaCrown, FaHatCowboySide, FaUserGraduate } from 'react-icons/fa';
import { LuBicepsFlexed } from "react-icons/lu";

export const Levels = {
  explorer: {
    name: 'explorer',
    label: 'TypeScript Explorer',
    description: "You're taking your first steps into the TypeScript world. Keep exploring!",
    nextLevelCriteria: 'Complete at least 10 challenges in the easy category',
  },
  apprentice: {
    name: 'apprentice',
    label: 'TypeScript Apprentice',
    description: "You're getting the hang of TypeScript basics. Ready for more?",
    nextLevelCriteria: 'Complete 5 challenges in the "medium" category',
  },
  specialist: {
    name: 'specialist',
    label: 'TypeScript Specialist',
    description: "You're starting to solve intermediate-level problems with confidence.",
    nextLevelCriteria: 'Complete at least 10 challenges in the "medium" category and 3 from the "hard" category',
  },
  expert: {
    name: 'expert',
    label: 'TypeScript Expert',
    description: "Your TypeScript skills are solid, and you're tackling tougher challenges!",
    nextLevelCriteria: 'Complete at least 5 challenges in the "hard" category and 1 from the "extreme" category',
  },
  master: {
    name: 'master',
    label: 'TypeScript Master',
    description: "You're a TypeScript powerhouse, mastering even the trickiest types.",
    nextLevelCriteria: 'Complete 10 challenges in the "extreme" category',
  },
  wizard: {
    name: 'wizard',
    label: 'TypeScript Wizard',
    description: 'You’ve reached the pinnacle of TypeScript wizardry—legendary skills unlocked!',
    nextLevelCriteria: undefined,
  },
} as const;

export type Level = (typeof Levels)[keyof typeof Levels];

export const LevelIcons = {
  explorer: FaBinoculars,
  apprentice: FaUserGraduate,
  specialist: FaHatCowboySide,
  expert: LuBicepsFlexed,
  master: FaCrown,
  wizard: FaHatWizard,
};
