import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import NavigationButtons from './NavigationButtons';
import Header from './Header';
import { randomizeCurrentWindow } from '../characterCreationSlice';

type WindowProps = {
  children?: React.ReactNode,
  header: string,
  randomize?: boolean,
  showNavigation?: boolean,
}

export default function Window({
  children, header, randomize, showNavigation,
}: WindowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleRandomize = () => {
    dispatch(randomizeCurrentWindow());
  };

  return (
    <WindowDiv>
      <Header>{header}</Header>
      {randomize && <RandomizeButton onClick={handleRandomize}>Randomize</RandomizeButton>}
      {children}
      {showNavigation && <NavigationButtons />}
    </WindowDiv>
  );
}

const WindowDiv = styled.div`
  background-color: #eee;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  position: relative;
  width: 30vw;
  max-width: 30em;
  height: 800px;
  overflow-y: auto;
  padding: 1em;
  padding-bottom: 3em;
`;

const RandomizeButton = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
`;
