import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from '4-react-ecsal';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { useIsTest } from '6-ui-features/TestContext';
import { createWorldMap } from '1-game-code/World/TerrainGen/TerrainGenSys';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll, finishCharacterCreation } from './characterCreationSlice';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const reduxDispatch = useReduxDispatch();
  const dispatch = useDispatch();
  const isTest = useIsTest();

  const handleRandomizeAllClick = () => {
    reduxDispatch(randomizeAll());
  };

  const handleFinish = async () => {
    if (isTest) {
      await dispatch(createWorldMap({ numPlates: 6, size: { x: 200, y: 100 } }));
    } else {
      await dispatch(createWorldMap({ numPlates: 7, size: { x: 800, y: 400 } }));
    }
    reduxDispatch(finishCharacterCreation());
    reduxDispatch(changedScene(Scene.Town));
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
