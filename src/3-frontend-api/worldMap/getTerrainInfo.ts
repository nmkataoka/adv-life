import { EntityManager } from '0-engine';
import { ElevationMetadata } from '1-game-code/World/TerrainGen/metadata';
import { WorldMap } from '1-game-code/World/WorldMap';
import { Selector } from '4-react-ecsal';
import { DeepReadonly } from 'ts-essentials';
import { getWorldMap } from './getWorldMap';

export const getElevationMetadata: Selector<DeepReadonly<ElevationMetadata> | undefined> = (
  eMgr: EntityManager,
) => {
  const worldMapCmpt = getWorldMap(eMgr);
  if (!worldMapCmpt) return undefined;
  const result = worldMapCmpt.data.metadata[WorldMap.Layer.Elevation];
  return result;
};
