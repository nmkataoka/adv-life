import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector as useReduxSelector } from 'react-redux';
import { useSelector } from '4-react-ecsal';
import { RootState } from '7-app/types';
import { getAllTowns } from '3-frontend-api';
import MapLocation from './MapLocation';
import { changedScene, Scenes } from '../sceneManager/sceneMetaSlice';
import { travelToLocation } from './actions';

export default function WorldMap(): JSX.Element {
  const dispatch = useDispatch();
  const isInCombat = useReduxSelector((state: RootState) => state.combatScene.isInCombat);
  const towns = useSelector(getAllTowns);

  const handleCombatClick = () => {
    if (!isInCombat) {
      dispatch(travelToLocation({ id: -1, locationType: 'Combat' }));
      dispatch(changedScene(Scenes.Combat));
    }
  };

  const handleTownClick = (townId: number) => () => {
    if (!isInCombat) {
      dispatch(travelToLocation({ id: townId, locationType: 'Town' }));
      dispatch(changedScene(Scenes.Town));
    }
  };

  return (
    <Container>
      <h1>World Map</h1>
      <LocationContainer>
        {towns.map(({ townId, name }) => (
          <MapLocation key={name} name={name} onClick={handleTownClick(townId)} />
        ))}
        <MapLocation name="Combat" onClick={handleCombatClick} />
        <MapLocation name="Combat" onClick={handleCombatClick} />
        <MapLocation name="Combat" onClick={handleCombatClick} />
        <MapLocation name="Combat" onClick={handleCombatClick} />
      </LocationContainer>
    </Container>
  );
}

const Container = styled.div`
  min-width: 500px;
  min-height: 300px;
`;

const LocationContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;
