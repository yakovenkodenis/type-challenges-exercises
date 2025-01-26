import { useEffect, useState, useCallback, memo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router';
import { type OnChange, type OnValidate } from '@monaco-editor/react';
import styled from '@emotion/styled';

// Components
import { Sidebar } from '../sidebar';
import { FileTree } from '../file-tree';
import { CodeEditor } from '../editor';
import { Footer } from '../footer';
import { MarkdownPreview } from '../markdown-preview';

// Context
import { useChallenges } from '../../context/challenges';
import { useCurrentChallenge } from '../../context/current-challenge';

// Constants
import { ChallengeFiles } from '../../constants/challenge-files';
import { ChallengeStatuses } from '../../constants/challenge-status';

// Utils
import { findFileByName, type File, } from '../../utils/file-manager';
import { challengeToDir } from '../../utils/challenge-to-dir';

// Services
import { MainFolder } from '../../services/challenges';
import { getChallengeFromCache } from '../../services/challenge-cache';
import { getChallengeProgress, saveChallengeProgress } from '../../services/persistence';

const Challenge: FC = () => {
  const { challengeId } = useParams<{ challengeId: string; }>();
  const [templateFileContent, setTemplateFileContent] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const {
    rootDir, setRootDir,
    selectedFile, setSelectedFile,
    challengeStatus, setChallengeStatus,
    setChallengeId,
  } = useCurrentChallenge();

  const { isLoading, challengesMetadataLinkedMap, recalculateStatistics } = useChallenges();

  useEffect(() => {
    if (challengeId) setChallengeId(challengeId);
  }, [challengeId, setChallengeId]);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId) return;

      const path = `${MainFolder}/${challengeId}`;

      const [
        challenge,
        challengeProgress,
      ] = await Promise.all([
        getChallengeFromCache(path),
        getChallengeProgress(challengeId),
      ]);

      if (challengeProgress) {
        challenge.files.template = challengeProgress.content;

        if (challengeProgress.completed) {
          setChallengeStatus(ChallengeStatuses.success);
        }
      }

      const dir = challengeToDir(challenge, { concatTestCases: challengeProgress?.content === undefined });
      setRootDir(dir);
      setSelectedFile(findFileByName(dir, ChallengeFiles.template));
    }

    loadChallenge();
  }, [challengeId, setRootDir, setChallengeStatus, setSelectedFile]);

  const onSelect = useCallback((file: File) => setSelectedFile(file), [setSelectedFile]);

  const onValidate: OnValidate = useCallback(async (markers) => {
    const errors = markers
      .filter((marker) => !['6205', '6196', '6133'].includes(marker.code as string))
      .map((marker) => `line ${marker.startLineNumber}: ${marker.message} (.${marker.resource.path})`);

    setErrors(errors);

    const hasErrors = !!errors.length;

    if (selectedFile?.name === ChallengeFiles.template && selectedFile?.parentId) {
      setChallengeStatus(hasErrors ? ChallengeStatuses.error : ChallengeStatuses.success);

      if (templateFileContent) {
        await saveChallengeProgress(selectedFile.parentId, {
          content: templateFileContent,
          completed: !hasErrors,
        });

        await recalculateStatistics();
      }
    }
  }, [recalculateStatistics, setChallengeStatus, selectedFile, templateFileContent]);

  const onChange: OnChange = useCallback(async (value) => {
    if (!challengeId) return;
    if (value === undefined || !selectedFile || !selectedFile.parentId) return;
    if (selectedFile.name !== ChallengeFiles.template) return;

    setTemplateFileContent(value);
  }, [challengeId, selectedFile]);

  const goToNextChallenge = useCallback(() => {
    if (!challengeId) return;

    const currentChallengeMetadata = challengesMetadataLinkedMap[challengeId];
    const nextChallengeName = currentChallengeMetadata?.next;

    if (nextChallengeName) {
      setChallengeStatus(ChallengeStatuses.unavailable);
      setTemplateFileContent(undefined);
      navigate(`/challenge/${MainFolder}/${nextChallengeName}`);
    } else {
      alert("You've reached the end of the list. Congratulations!");
    }
  }, [challengesMetadataLinkedMap, challengeId, navigate, setChallengeStatus]);

  if (!challengeId || !selectedFile) {
    return <div>Challenge not selected </div>;
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
          <CodeEditor selectedFile={selectedFile} rootDir={rootDir} onValidate={onValidate} onChange={onChange} />
        )}
        <Footer
          isLoading={isLoading}
          errors={errors}
          challengeStatus={challengeStatus}
          goToNextChallenge={goToNextChallenge}
        />
      </MainContent>
    </>
  );
};

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export default memo(Challenge);
