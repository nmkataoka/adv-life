import styled from '@emotion/styled';
import { useDispatch, useSelector as useReduxSelector } from 'react-redux';
import { useSelector } from '4-react-ecsal';
import { RootState } from '7-app/types';
import { getAllTowns } from '3-frontend-api';
import MapLocation from './MapLocation';
import { changedScene, Scene } from '../sceneManager/sceneMetaSlice';
import { travelToLocation } from './actions';
import WorldMapCanvas from './WorldMapCanvas';

const mapHeight = 400;
const mapWidth = 600;
const mapPaddingSides = 10;
const mapPaddingBottom = 10;

export default function WorldMap(): JSX.Element {
  const dispatch = useDispatch();
  const isInCombat = useReduxSelector((state: RootState) => state.combatScene.isInCombat);
  const towns = useSelector(getAllTowns);

  const handleCombatClick = () => {
    if (!isInCombat) {
      dispatch(travelToLocation({ id: -1, locationType: 'Combat' }));
      dispatch(changedScene(Scene.Colosseum));
    }
  };

  const handleTownClick = (townId: number) => () => {
    if (!isInCombat) {
      dispatch(travelToLocation({ id: townId, locationType: 'Town' }));
      dispatch(changedScene(Scene.Town));
    }
  };

  return (
    <Container>
      <h1>World Map</h1>
      <WorldMapContainer>
        <WorldMapCanvas height={mapHeight} width={mapWidth} />
        <LocationContainer>
          {towns.map(({ townId, name }) => (
            <MapLocation key={name} name={name} onClick={handleTownClick(townId)} />
          ))}
          <MapLocation name="Combat" onClick={handleCombatClick} />
          <MapLocation name="Combat" onClick={handleCombatClick} />
          <MapLocation name="Combat" onClick={handleCombatClick} />
          <MapLocation name="Combat" onClick={handleCombatClick} />
        </LocationContainer>
      </WorldMapContainer>
    </Container>
  );
}

const Container = styled.div`
  box-sizing: border-box;
  width: ${mapWidth + 2 * mapPaddingSides}px;
  height: ${mapHeight + 70 + mapPaddingBottom}px;
  padding: 0 ${mapPaddingBottom}px ${mapPaddingSides}px;
`;

const WorldMapContainer = styled.div`
  position: relative;
`;

const LocationContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: absolute;
  z-index: 1;
`;
