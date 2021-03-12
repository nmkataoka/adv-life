import styled from '@emotion/styled';
import { useDispatch, useSelector2 } from '4-react-ecsal';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { useIsTest } from '6-ui-features/TestContext';
import { createWorld } from '6-ui-features/WorldGenScene/Sidebar/createWorld';
import { WorldGenModules, WorldGenModulesTest } from '6-ui-features/WorldGenScene/constants';
import { useEffect } from 'react';
import { getAllTowns, getPlayerId } from '3-frontend-api';
import { travelToTown } from '1-game-code/Unit/TravelToLocationSys';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll, createPlayerCharacter } from './characterCreationSlice';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const reduxDispatch = useReduxDispatch();
  const dispatch = useDispatch();
  const isTest = useIsTest();
  const playerId = useSelector2(getPlayerId);
  const townIds = useSelector2(getAllTowns);

  const handleRandomizeAllClick = () => {
    reduxDispatch(randomizeAll());
  };

  const handleFinish = async () => {
    if (isTest) {
      await dispatch(createWorld('a wonderful life', WorldGenModulesTest));
    } else {
      await dispatch(createWorld('a wonderful life', WorldGenModules));
    }
    reduxDispatch(createPlayerCharacter());
  };

  // Once the player is created, automatically go to a town
  useEffect(() => {
    if (typeof playerId === 'number' && playerId > -1 && townIds) {
      void dispatch(travelToTown({ entityId: playerId, townId: townIds[0].townId })).then(() => {
        reduxDispatch(changedScene(Scene.Town));
      });
    }
  }, [dispatch, reduxDispatch, playerId, townIds]);

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
