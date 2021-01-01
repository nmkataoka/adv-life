import { EntityManager } from '0-engine';
import { DataLayer } from '1-game-code/World';
import { WorldMapCmpt } from '1-game-code/World/WorldMapCmpt';
import { Selector } from '4-react-ecsal';

export const getWorldMap: Selector<WorldMapCmpt | undefined> = (eMgr: EntityManager) => {
  const worldMapCmpt = eMgr.tryGetUniqueCmpt(WorldMapCmpt);
  return worldMapCmpt;
};

export const getWorldMapLayer = (layer: string): Selector<DataLayer | undefined> => (
  eMgr: EntityManager,
) => {
  const worldMapCmpt = getWorldMap(eMgr);
  if (!worldMapCmpt) return undefined;
  const dataLayer = worldMapCmpt.data.dataLayers[layer];
  return dataLayer;
};
