import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import MapLocation from './MapLocation';
import { changedScene, Scenes } from '../sceneManager/sceneMetaSlice';
import { RootState } from '../../7-app/types';

export default function WorldMap(): JSX.Element {
  const dispatch = useDispatch();
  const isInCombat = useSelector((state: RootState) => state.combatScene.isInCombat);

  const handleCombatClick = () => {
    if (!isInCombat) {
      dispatch(changedScene(Scenes.Combat));
    }
  };

  const handleTownClick = () => {
    if (!isInCombat) {
      dispatch(changedScene(Scenes.Town));
    }
  };

  return (
    <Container>
      <h1>World Map</h1>
      <LocationContainer>
        <MapLocation name="Town" onClick={handleTownClick} />
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
