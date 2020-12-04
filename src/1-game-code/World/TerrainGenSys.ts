import { createEventListener, ECSystem, EventSys } from '0-engine';
import { WorldMapCmpt } from './WorldMapCmpt';
import { WorldMap } from './WorldMap';
import { createRandomTerrain } from './createRandomTerrain';
import { CREATE_NOISED_WORLD_MAP } from './constants';

const createNoisedWorldMapSlice = createEventListener({
  writeCmpts: [WorldMapCmpt],
})<undefined>(function createNoisedWorldMap({
  eMgr,
  componentManagers: {
    writeCMgrs: [worldMapMgr],
  },
}) {
  const worldMap = eMgr.createEntity('worldMap');
  const worldMapCmpt = new WorldMapCmpt();
  worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();
  worldMapMgr.add(worldMap, worldMapCmpt);
});

export class TerrainGenSys extends ECSystem {
  public Start = (): void => {
    this.eMgr
      .getSys(EventSys)
      .RegisterListener(CREATE_NOISED_WORLD_MAP, createNoisedWorldMapSlice.eventListener);

    // TODO: remove
    void createNoisedWorldMapSlice.eventListener.callback({
      eMgr: this.eMgr,
      componentManagers: createNoisedWorldMapSlice.eventListener.componentDependencies.getComponentManagers(
        this.eMgr,
      ),
      payload: undefined,
    });
  };

  public OnUpdate = (): void => {};
}
