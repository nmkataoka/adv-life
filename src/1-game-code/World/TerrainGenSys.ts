import { ECSystem, EventCallbackArgs, EventSys } from '0-engine';
import { WorldMapCmpt } from './WorldMapCmpt';
import { WorldMap } from './WorldMap';
import { createRandomTerrain } from './createRandomTerrain';
import { CREATE_NOISED_WORLD_MAP } from './constants';

const createNoisedWorldMap = ({ eMgr }: EventCallbackArgs<void>) => {
  const worldMap = eMgr.createEntity('worldMap');
  const worldMapCmpt = new WorldMapCmpt();
  worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();
  eMgr.addCmpt(worldMap, worldMapCmpt);
};

export class TerrainGenSys extends ECSystem {
  public Start = (): void => {
    this.eMgr.getSys(EventSys).RegisterListener(CREATE_NOISED_WORLD_MAP, createNoisedWorldMap);

    // TODO: remove
    createNoisedWorldMap({ eMgr: this.eMgr, payload: undefined });
  };

  public OnUpdate = (): void => {};
}
