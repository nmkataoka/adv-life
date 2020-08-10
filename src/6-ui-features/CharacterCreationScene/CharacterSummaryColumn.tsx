import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll } from './characterCreationSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const dispatch = useDispatch();

  const handleRandomizeAllClick = () => {
    dispatch(randomizeAll());
  };

  return (
    <Container>
      <RandomizeButton onClick={handleRandomizeAllClick}>Randomize All</RandomizeButton>
      <CharacterSummary />
    </Container>
  );
};

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 0 1em;
`;

const RandomizeButton = styled.button`
  padding: 1em;
`;

export default CharacterSummaryColumn;
