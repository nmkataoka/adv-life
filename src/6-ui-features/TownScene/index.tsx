import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useReduxSelector, useReduxDispatch } from '11-redux-wrapper';
import { useSelector2 } from '4-react-ecsal';
import { RootState } from '7-app/types';
import { getTown } from '3-frontend-api';
import TopBar from '6-ui-features/TopBar';
import TownLocation from '../TownLocation';
import PartySummary from './PartySummary';
import { changedTitle } from '../TopBar/topBarSlice';

const selectCurTownId = (state: RootState) => state.townScene.currentTownId;

export default function TownScene(): JSX.Element {
  const dispatch = useReduxDispatch();
  const townId = useReduxSelector(selectCurTownId);
  const { locationIds: townLocationIds, name: townName } = useSelector2(getTown(townId)) ?? {
    locationIds: [],
    name: 'Unnamed',
  };

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
    <>
      <TopBar />
      <Container>
        <MainContent>
          <PartySummary />
          <LocationContainer>
            {/* $FIXME - `as any[]` can be removed in TypeScript 4.2 */}
            {(townLocationIds as any[]).map((townLocationId) => (
              <TownLocation key={townLocationId} townLocationId={townLocationId} />
            ))}
          </LocationContainer>
        </MainContent>
      </Container>
    </>
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
