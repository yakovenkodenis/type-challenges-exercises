// Modules
import { useEffect, useState, useCallback, Fragment } from 'react';
import styled from '@emotion/styled';
import { RiResetLeftLine } from "react-icons/ri";

// Components
import { FileTree } from '../file-tree';

// Constants
import { LevelIcons } from '../../constants/levels';

// Context
import { useChallenges } from '../../context/challenges';

// Utils
import { Type, type File, type Directory } from '../../utils/file-manager';
import { challengesMetadataToDir } from '../../utils/challenges-metadata-to-dir';

type Props = {
  close: () => void;
  onSelectChallenge: (id: string) => void;
  onResetChallenge: () => void;

  isOpen: boolean;
};

const noop = () => {};

const dummyDir: Directory = {
  id: '1',
  name: 'fetching challenges...',
  type: Type.DUMMY,
  parentId: undefined,
  depth: 0,
  dirs: [],
  files: [],
};

export default function DrawerContainer(props: Props) {
  const {
    isOpen,
    close = noop,
    onSelectChallenge = noop,
    onResetChallenge = noop,
  } = props;

  const { groupedChallengesMetadata, level, progressStatistics } = useChallenges();
  const Icon = level ? LevelIcons[level.name] : LevelIcons.explorer;

  const [rootDir, setRootDir] = useState<Directory>(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const onSelect = useCallback((file: File) => {
    setSelectedFile(file);
    onSelectChallenge(file.id);
    close();
  }, [close, onSelectChallenge]);

  useEffect(() => {
    if (groupedChallengesMetadata) {
      const dir = challengesMetadataToDir(groupedChallengesMetadata);
      setRootDir(dir);
    }
  }, [groupedChallengesMetadata]);

  return (
    <>
      {isOpen && <Backdrop onClick={close} />}
      <Drawer isOpen={isOpen}>
        <DrawerHeader>
          {level ? (
            <Stats>
              <Description>My current level:</Description>
              <LevelIcon><Icon /></LevelIcon>
              <LevelTitle>{level.label}</LevelTitle>
              <Description>{level.description}</Description>
              {level.nextLevelCriteria ? (
                <NextLevelCriteria>
                  <strong>For the next level:</strong> {level.nextLevelCriteria}
                </NextLevelCriteria>
              ) : null}
              <ProgressTable>
                {Object.entries(progressStatistics).map(([difficulty, count]) => (
                  <Fragment key={difficulty}>
                    <ProgressItem>{difficulty}: {count}</ProgressItem>
                  </Fragment>
                ))}
              </ProgressTable>
            </Stats>
          ) : null}
          <Row>
            <ActionButton onClick={onResetChallenge}>
              <RiResetLeftLine /> Reset current challenge
            </ActionButton>
          </Row>
        </DrawerHeader>
        <DrawerContent>
          <DrawerTitle>Challenges</DrawerTitle>
          {rootDir ? (
            <FileTree
              rootDir={rootDir}
              onSelect={onSelect}
              selectedFile={selectedFile}
              sortDirectories={false}
              overrideSubTreeStyle={{ 0: () => ({ marginLeft: '-16px' }) }}
            />
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  );
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 19;
`;

const Drawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 300px;
  background: #252526;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.3);
  transform: translateX(${(props) => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  z-index: 20;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const DrawerHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #3c3c3c;
`;

const Stats = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const LevelIcon = styled.div`
  svg {
    width: 50px;
    height: 50px;
  }
`;

const LevelTitle = styled.h4`
  font-size: 18px;
  color: #d4d4d4;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const Description = styled.p`
  font-size: 12px;
  color: #a6a6a6;
  margin-bottom: 8px;
  margin-top: 0;
`;

const NextLevelCriteria = styled.p`
  font-size: 12px;
  color: #a6a6a6;
  margin-bottom: 12px;
`;

const ProgressTable = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  font-size: 12px;
  color: #d4d4d4;
  width: 100%;
  text-align: center;
`;

const ProgressItem = styled.div`
  padding: 4px 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ActionButton = styled.button`
  background: #007acc;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #005a9e;
  }
`;

const DrawerContent = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
`;

const DrawerTitle = styled.h3`
  font-size: 16px;
  color: #d4d4d4;
  margin-bottom: 12px;
`;
