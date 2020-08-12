import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { changedScreen } from './characterCreationSlice';
import { CharacterCreationScreens } from './characterCreationData';

const navItems = CharacterCreationScreens;

export default function CharacterCreationNavBar(): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = (screen: string) => () => {
    dispatch(changedScreen(screen));
  };

  return (
    <Container>
      {navItems.map(
        (screen) => (
          <NavItem
            key={screen}
            onClick={handleClick(screen)}
          >
            {screen}
          </NavItem>
        ),
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: lightblue;
`;

const NavItem = styled.button`
  background-color: #c0c0c0;
`;
