import React, { useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import MapLocation from './MapLocation';
import { changedScene, Scenes } from '../sceneManager/sceneMetaSlice';
import { RootState } from '../../7-app/types';
import { updateTownsFromEngine } from '../Town/townSlice';
import { travelToLocation } from './actions';

export default function WorldMap(): JSX.Element {
  const dispatch = useDispatch();
  const isInCombat = useSelector((state: RootState) => state.combatScene.isInCombat);
  const townsDict = useSelector((state: RootState) => state.town.byId);

  const towns = useMemo(() => Object.values(townsDict), [townsDict]);

  useEffect(() => {
    dispatch(updateTownsFromEngine());
  }, [dispatch]);

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
        {towns.map(({ townId, name }) => <MapLocation key={name} name={name} onClick={handleTownClick(townId)} />)}
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
