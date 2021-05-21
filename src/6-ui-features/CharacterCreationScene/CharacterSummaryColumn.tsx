import styled from '@emotion/styled';
import { useDispatch, useSelector2 } from '4-react-ecsal';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllTowns, getPlayerId } from '3-frontend-api';
import { travelToTown } from '1-game-code/Unit/TravelToLocationSys';
import { NULL_ENTITY } from '0-engine';
import CharacterSummary from './components/CharacterSummary';
import { randomizeAll, createPlayerCharacter } from './characterCreationSlice';
import { changedScene } from '../sceneManager/sceneMetaSlice';

const CharacterSummaryColumn = (): JSX.Element => {
  const reduxDispatch = useReduxDispatch();
  const dispatch = useDispatch();
  const playerId = useSelector2(getPlayerId);
  const townIds = useSelector2(getAllTowns);

  const handleRandomizeAllClick = () => {
    reduxDispatch(randomizeAll());
  };

  const handleFinish = () => {
    reduxDispatch(createPlayerCharacter());
  };

  // Once the player is created, automatically go to a town
  useEffect(() => {
    if (playerId !== NULL_ENTITY && playerId !== undefined && townIds?.length === 0) {
      throw new Error('Player was created but no towns exist.');
    }
    if (typeof playerId === 'number' && playerId > -1 && townIds && townIds.length > 0) {
      void dispatch(travelToTown({ entityId: playerId, townId: townIds[0].townId })).then(() => {
        reduxDispatch(changedScene('town'));
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
