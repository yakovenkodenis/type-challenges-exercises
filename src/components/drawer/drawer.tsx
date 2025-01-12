// Modules
import { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

// Components
import { FileTree } from '../file-tree';

// Context
import { useChallenges } from '../../context/challenges';

// Utils
import { Type, type File, type Directory } from '../../utils/file-manager';
import { challengesMetadataToDir } from '../../utils/challenges-metadata-to-dir';

type User = {
  avatar: string;
  email: string;
};

type Props = {
  user: User | null;
  close: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onSelectChallenge: (id: string) => void;

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
    user,
    isOpen,
    close = noop,
    onLogin = noop,
    onLogout = noop,
    onSelectChallenge = noop,
  } = props;

  const { groupedChallengesMetadata } = useChallenges();

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
          {user ? (
            <>
              <Avatar src={user.avatar} alt='User Avatar' />
              <Email>{user.email}</Email>
              <ActionButton onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </ActionButton>
            </>
          ) : (
            <ActionButton onClick={onLogin}>
              <FaSignInAlt /> Login
            </ActionButton>
          )}
        </DrawerHeader>
        <DrawerContent>
          <DrawerTitle>Challenges</DrawerTitle>
          {rootDir ? (
            <FileTree
              rootDir={rootDir}
              onSelect={onSelect}
              selectedFile={selectedFile}
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

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
`;

const Email = styled.div`
  font-size: 14px;
  color: #d4d4d4;
  margin-bottom: 16px;
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
