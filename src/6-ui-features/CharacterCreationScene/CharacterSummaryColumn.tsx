import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll, finishCharacterCreation } from './characterCreationSlice';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const dispatch = useDispatch();

  const handleRandomizeAllClick = () => {
    dispatch(randomizeAll());
  };

  const handleFinish = () => {
    dispatch(finishCharacterCreation());
    dispatch(changedScene(Scene.Town));
  };

  return (
    <Container>
      <RandomizeButton onClick={handleRandomizeAllClick}>Randomize All</RandomizeButton>
      <CharacterSummary />
      <FinishButton onClick={handleFinish}>Done</FinishButton>
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

const FinishButton = styled.button`
  padding: 1em 3em;
`;

export default CharacterSummaryColumn;
