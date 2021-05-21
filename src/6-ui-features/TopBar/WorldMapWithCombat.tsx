import styled from '@emotion/styled';
import { useReduxDispatch, useReduxSelector } from '11-redux-wrapper';
import { useSelector2 } from '4-react-ecsal';
import { RootState } from '7-app/types';
import { getAllTowns, getPlayerId } from '3-frontend-api';
import { travelToTown } from '1-game-code/Unit/TravelToLocationSys';
import { Map } from '6-ui-features/WorldMap';
import MapLocation from '../WorldMap/MapLocation';
import { changedScene } from '../sceneManager/sceneMetaSlice';

const mapHeight = 400;
const mapWidth = 600;
const mapPaddingSides = 10;
const mapPaddingBottom = 10;

export function WorldMapWithCombat(): JSX.Element {
  const dispatch = useReduxDispatch();
  const isInCombat = useReduxSelector((state: RootState) => state.combatScene.isInCombat);
  const towns = useSelector2(getAllTowns) ?? [];
  const playerId = useSelector2(getPlayerId) ?? -1;

  const handleCombatClick = () => {
    if (!isInCombat) {
      // Need to update travelToTown to accomodate combat locations
      // dispatch(travelToLocation({ id: -1, locationType: 'Combat' }));
      dispatch(changedScene('colosseum'));
    }
  };

  const handleTownClick = (townId: number) => () => {
    if (!isInCombat) {
      dispatch(travelToTown({ entityId: playerId, townId }));
      dispatch(changedScene('town'));
    }
  };

  return (
    <Container>
      <h1>World Map</h1>
      <WorldMapContainer>
        <Map>
          <LocationContainer>
            {towns.map(({ townId, name }) => (
              <MapLocation key={name} name={name} onClick={handleTownClick(townId)} />
            ))}
            <MapLocation name="Combat" onClick={handleCombatClick} />
            <MapLocation name="Combat" onClick={handleCombatClick} />
            <MapLocation name="Combat" onClick={handleCombatClick} />
            <MapLocation name="Combat" onClick={handleCombatClick} />
          </LocationContainer>
        </Map>
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
  height: ${mapHeight}px
  width: ${mapWidth}px;
`;

const LocationContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: absolute;
  z-index: 1;
`;
