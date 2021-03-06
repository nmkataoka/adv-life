import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { getColor } from '6-ui-features/Theme';
import { useClearInfo } from '6-ui-features/Info';
import { changedScreen } from './characterCreationSlice';
import { CharacterCreationScreens } from './characterCreationData';

const navItems = CharacterCreationScreens;

export default function CharacterCreationNavBar(): JSX.Element {
  const dispatch = useDispatch();
  const clearInfo = useClearInfo();

  const handleClick = (screen: string) => () => {
    clearInfo();
    dispatch(changedScreen(screen));
  };

  return (
    <Container>
      {navItems.map((screen) => (
        <NavItem key={screen} onClick={handleClick(screen)}>
          {screen}
        </NavItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${getColor('white')};
`;

const NavItem = styled.button`
  background-color: ${getColor('blueDarker')};
  color: ${getColor('white')};
`;
