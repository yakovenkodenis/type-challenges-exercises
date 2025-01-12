import styled from '@emotion/styled';
import { FaBars } from 'react-icons/fa';

type Props = {
  toggleDrawer: () => void;
};

const noop = () => {};

export default function HeaderContainer(props: Props) {
  const { toggleDrawer = noop } = props;

  return (
    <Header>
      <HeaderLeft>
        <HeaderText>My TypeScript Challenges</HeaderText>
      </HeaderLeft>
      <HeaderRight>
        <MenuIcon onClick={toggleDrawer}>
          <FaBars />
        </MenuIcon>
      </HeaderRight>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
  padding: 0 16px;
  height: 36px;
`;

const HeaderLeft = styled.div``;

const HeaderText = styled.span`
  color: #d4d4d4;
  font-size: 14px;
  font-weight: bold;
`;

const HeaderRight = styled.div``;

const MenuIcon = styled.div`
  color: #d4d4d4;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: #ffffff;
  }
`;
