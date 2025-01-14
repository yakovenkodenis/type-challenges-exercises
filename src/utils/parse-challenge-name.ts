import { difficultyOrder, type DifficultyLevel } from '../constants/difficulty-levels';

export const parseChallengeName = (name: string) => {
  const [numberPart, difficultyPart] = (name.match(/^(\d+)-(warm|easy|medium|hard|extreme)/)?.slice(1) || []) as [`${number}`, DifficultyLevel] ;

  const number = parseInt(numberPart, 10) || 0;
  const difficultyIndex = difficultyOrder.indexOf(difficultyPart);

  return {
    number,
    difficultyIndex,
    difficulty: difficultyPart,
  }
}
