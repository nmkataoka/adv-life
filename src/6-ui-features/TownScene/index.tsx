import React, { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import TownLocation from '../TownLocation';
import PartySummary from './PartySummary';
import useUILoop from '../useUILoop';
import { updateTownsFromEngine } from '../Town/townSlice';
import { RootState } from '../../7-app/types';
import { updateTownLocationsFromEngine } from '../TownLocation/townLocationSlice';
import { changedTitle } from '../TopBar/topBarSlice';

const selectTownLocations = (state: RootState) => {
  const curTownId = state.townScene.currentTownId;
  const { byId: { [curTownId]: town } } = state.town;

  let locationIds: number[] = [];
  let name = 'Unnamed';
  if (town) {
    ({ locationIds, name } = town);
  }
  return { townId: curTownId, townLocationIds: locationIds, townName: name };
};

export default function TownScene(): JSX.Element {
  const dispatch = useDispatch();
  const { townId, townLocationIds, townName } = useSelector(selectTownLocations, shallowEqual);
  const engineUpdates = useMemo(() => [
    updateTownsFromEngine,
    () => updateTownLocationsFromEngine(townLocationIds),
  ], [townLocationIds]);
  useUILoop(engineUpdates);

  useEffect(() => {
    dispatch(changedTitle(townName));
  }, [dispatch, townName]);

  if (townId < 0) {
    return <Container><MainContent>ERROR: townId is less than 0</MainContent></Container>;
  }

  return (
    <Container>
      <MainContent>
        <PartySummary />
        <LocationContainer>
          {townLocationIds.map(
            (townLocationId) => <TownLocation key={townLocationId} townLocationId={townLocationId} />,
          )}
        </LocationContainer>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  min-height: 70vh;
  align-items: stretch;
`;

const MainContent = styled.div`
  flex: 1 1 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-content: center;
`;

const LocationContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: space-around;
`;
