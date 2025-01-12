import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { type OnValidate } from '@monaco-editor/react';
import styled from '@emotion/styled';

// Components
import { Sidebar } from '../sidebar';
import { FileTree } from '../file-tree';
import { CodeEditor } from '../editor';
import { Footer } from '../footer';
import { MarkdownPreview } from '../markdown-preview';

// Context
import { useChallenges } from '../../context/challenges';

// Utils
import { findFileByName, Type, type File, type Directory } from '../../utils/file-manager';
import { typeChallenges } from '../../utils/tmp-tree';

const dummyDir: Directory = {
  id: '1',
  name: 'loading...',
  type: Type.DUMMY,
  parentId: undefined,
  depth: 0,
  dirs: [],
  files: [],
};

const Challenge = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);

  const { isLoading, challenges } = useChallenges();

  console.log({ challenges });

  useEffect(() => {
    const root = typeChallenges[Number(challengeId) - 1];

    setRootDir(root);
    setSelectedFile(findFileByName(root, 'challenge.ts'));
  }, [challengeId]);

  const onSelect = useCallback((file: File) => setSelectedFile(file), []);

  const onValidate: OnValidate = useCallback((markers) => {
    setErrors(
      markers
        .filter((marker) => !['6205', '6196'].includes(marker.code as string))
        .map((marker) => `line ${marker.startLineNumber}: ${marker.message} (.${marker.resource.path})`)
    );
  }, []);

  if (!challengeId) {
    return <div>Challenge not selected (wrong route)</div>;
  }

  if (!selectedFile) {
    return <div>Loading challenge...</div>;
  }

  if (!rootDir) {
    return <div>Challenge not found</div>;
  }

  return (
    <>
      <Sidebar>
        <FileTree rootDir={rootDir} selectedFile={selectedFile} onSelect={onSelect} />
      </Sidebar>
      <MainContent>
        {selectedFile.name.endsWith('.md') ? (
          <MarkdownPreview content={selectedFile.content} />
        ) : (
          <CodeEditor selectedFile={selectedFile} rootDir={rootDir} onValidate={onValidate} />
        )}
        <Footer isLoading={isLoading} errors={errors} challengeStatus={errors.length === 0 ? 'success' : 'error'} />
      </MainContent>
    </>
  );
};

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative; /* Ensure the footer is aligned to this container */
`;

export default Challenge;
