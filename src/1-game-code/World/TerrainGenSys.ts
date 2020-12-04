import { copyEventSlice, createEventSlice, DefaultEvent } from '0-engine';
import { WorldMapCmpt } from './WorldMapCmpt';
import { WorldMap } from './WorldMap';
import { createRandomTerrain } from './createRandomTerrain';

const createNoisedWorldMapSlice = createEventSlice('createNoisedWorldMap', {
  writeCmpts: [WorldMapCmpt],
})<undefined>(
  ({
    eMgr,
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    const worldMap = eMgr.createEntity('worldMap');
    const worldMapCmpt = new WorldMapCmpt();
    worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();
    worldMapMgr.add(worldMap, worldMapCmpt);
  },
);

// TODO: move this off of start into its own event
const start = copyEventSlice(DefaultEvent.Start, createNoisedWorldMapSlice);

export default [start.eventListener, createNoisedWorldMapSlice.eventListener];
