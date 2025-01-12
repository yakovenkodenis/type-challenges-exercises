import type { Directory } from './file-manager';

const challenges = [{
  name: 'Pick (easy)',
  template: `
type MyPick<T, K> = any
  `,
  testCases: `
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  // @ts-expect-error
  MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}
  `,
  hint: `
:satellite: Use mapped types ([https://www.typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html))
  `,
}, {
  name: 'Readonly (easy)',
  template: `
type MyReadonly<T> = any
  `,
  testCases: `
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyReadonly<Todo1>, Readonly<Todo1>>>,
]

interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}
  `,
  hint: `
Use mapped types (https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)[https://www.typescriptlang.org/docs/handbook/2/mapped-types.html]
  `,
}];

export const typeChallenges = challenges.map((challenge, idx) => {
  return {
    challengeName: challenge.name,
    challengeId: idx,
    depth: 0,
    type: 1,
    id: '0',
    name: 'root',
    parentId: undefined,
    files: [],
    dirs: [{
      id: 'src-folder',
      name: `challenge-${idx + 1}`,
      parentId: '0',
      type: 1,
      depth: 1,
      dirs: [],
      files: [{
        depth: 2,
        id: 'challenge-file',
        name: 'challenge.ts',
        parentId: 'src-folder',
        type: 0,
        content: `${challenge.template}
  
// ========== TEST CASES (do not edit) ==========
${challenge.testCases}
        `,
      }, {
        depth: 2,
        id: 'readme-file',
        name: 'README.md',
        parentId: 'src-folder',
        type: 0,
        content: challenge.hint ? `
### Hint

${challenge.hint}
        ` : ''
      }, {
        depth: 2,
        id: 'test-utils',
        name: 'test-utils.ts',
        parentId: 'src-folder',
        type: 0,
        content: `
  export type Expect<T extends true> = T;
  export type ExpectTrue<T extends true> = T;
  export type ExpectFalse<T extends false> = T;
  export type IsTrue<T extends true> = T;
  export type IsFalse<T extends false> = T;
  
  export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
    T,
  >() => T extends Y ? 1 : 2
    ? true
    : false;
  export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
  
  // https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
  export type IsAny<T> = 0 extends 1 & T ? true : false;
  export type NotAny<T> = true extends IsAny<T> ? false : true;
  
  export type Debug<T> = { [K in keyof T]: T[K] };
  export type MergeInsertions<T> = T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T;
  
  export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>;
  
  /**
   * Expect that one type is assignable to another.
   *
   * @example
   *
   * type tests = [
   *   // Expect that \`number\` is assignable to \`1\`.
   *   Expect<Extends<1, number>>,
   *   // Expect that \`abc\` is assignable to \`string\`
   *   Expect<Extends<'abc', string>>,
   * ];
   */
  export type Extends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false;
  export type ExpectValidArgs<
    FUNC extends (...args: any[]) => any,
    ARGS extends any[],
  > = ARGS extends Parameters<FUNC> ? true : false;
  
  export type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
        `,
      }]
    }]
  } satisfies Directory & { challengeName: string, challengeId: number };
});