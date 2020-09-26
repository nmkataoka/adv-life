import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useSelector as useReduxSelector, useDispatch } from 'react-redux';
import { useSelector } from '4-react-ecsal';
import { RootState } from '7-app/types';
import { getTownInfo } from '3-frontend-api';
import TownLocation from '../TownLocation';
import PartySummary from './PartySummary';
import { changedTitle } from '../TopBar/topBarSlice';

const selectCurTownId = (state: RootState) => state.townScene.currentTownId;

export default function TownScene(): JSX.Element {
  const dispatch = useDispatch();
  const townId = useReduxSelector(selectCurTownId);
  const { locationIds: townLocationIds, name: townName } = useSelector(getTownInfo(townId));

  useEffect(() => {
    dispatch(changedTitle(townName));
  }, [dispatch, townName]);

  if (townId < 0) {
    return (
      <Container>
        <MainContent>ERROR: townId is less than 0</MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <MainContent>
        <PartySummary />
        <LocationContainer>
          {townLocationIds.map((townLocationId) => (
            <TownLocation key={townLocationId} townLocationId={townLocationId} />
          ))}
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
