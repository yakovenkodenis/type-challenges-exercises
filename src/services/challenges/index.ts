const GITHUB_API_URL = 'https://api.github.com/repos/type-challenges/type-challenges/contents/questions';

export type Challenge = {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  files: {
    template: string;
    testCases: string;
    readme: string;
  };
};

export const fetchChallenges = async (): Promise<Challenge[]> => {
  const response = await fetch(GITHUB_API_URL);
  const data = await response.json();

  console.log(data);

  // return await Promise.all(
  //   data.map(async (file: { name: string; path: string }) => {
  //     const challengeResponse = await fetch(
  //       `https://api.github.com/repos/type-challenges/type-challenges/contents/${file.path}`
  //     );
  //     const challengeFiles = await challengeResponse.json();

  //     const fetchFileContent = async (filePath: string) => {
  //       const fileResponse = await fetch(filePath);
  //       return await fileResponse.text();
  //     };

  //     const template = await fetchFileContent(
  //       challengeFiles.find((f: { name: string }) => f.name === 'template.ts').download_url
  //     );
  //     const testCases = await fetchFileContent(
  //       challengeFiles.find((f: { name: string }) => f.name === 'test-cases.ts').download_url
  //     );
  //     const readme = await fetchFileContent(
  //       challengeFiles.find((f: { name: string }) => f.name === 'README.md').download_url
  //     );

  //     return {
  //       id: file.name,
  //       name: file.name.replace(/^\d+-/, '').replace(/-/g, ' '),
  //       difficulty: getDifficultyFromName(file.name),
  //       files: { template, testCases, readme },
  //     };
  //   })
  // );
};

const getDifficultyFromName = (name: string): Challenge['difficulty'] => {
  if (name.includes('easy')) return 'easy';
  if (name.includes('medium')) return 'medium';
  if (name.includes('hard')) return 'hard';
  return 'extreme';
};
