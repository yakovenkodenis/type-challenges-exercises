import styled from '@emotion/styled';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

type User = {
  avatar: string;
  email: string;
};

type Challenge = {
  challengeId: number;
  challengeName: string;
};

type Props = {
  user: User | null;
  challenges: Challenge[];
  close: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onSelectChallenge: (id: string | number) => void;

  isOpen: boolean;
};

const EMPTY_ARRAY: Array<Challenge> = [];
const noop = () => {};

export default function DrawerContainer(props: Props) {
  const {
    user,
    isOpen,
    close = noop,
    challenges = EMPTY_ARRAY,
    onLogin = noop,
    onLogout = noop,
    onSelectChallenge = noop,
  } = props;

  return (
    <>
      {isOpen && <Backdrop onClick={close} />}
      <Drawer isOpen={isOpen}>
        <DrawerHeader>
          {user ? (
            <>
              <Avatar src={user.avatar} alt="User Avatar" />
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
          <ChallengeList>
            {challenges.map((challenge) => (
              <ChallengeItem key={challenge.challengeName} onClick={() => onSelectChallenge(challenge.challengeId)}>
                {challenge.challengeName}
              </ChallengeItem>
            ))}
          </ChallengeList>
        </DrawerContent>
      </Drawer>
    </>
  )
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

const ChallengeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChallengeItem = styled.li`
  padding: 8px 12px;
  background: #3c3c3c;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #d4d4d4;

  &:hover {
    background: #555555;
  }
`;

