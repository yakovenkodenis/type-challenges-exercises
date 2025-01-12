import { useEffect } from 'react';
import { buildFileTree, type Directory } from './file-manager';

export const useFilesFromSandbox = (id: string, callback: (dir: Directory) => void) => {
  useEffect(() => {
    fetch('https://codesandbox.io/api/v1/sandboxes/' + id)
      .then((response) => response.json())
      .then(({ data }) => {
        const rootDir = buildFileTree(data);
        console.log(rootDir);
        callback(rootDir);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
