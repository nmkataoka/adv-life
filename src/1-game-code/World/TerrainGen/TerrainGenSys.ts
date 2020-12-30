import { copyEventSlice, createEventSlice, DefaultEvent } from '0-engine';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { WorldMap } from '../WorldMap';
// import { createRandomTerrain } from './createRandomTerrain';
import { generateTectonics } from './tectonicGeneration';
import { rasterizeTectonics } from './tectonicRasterization';
import { lowFreqNoise } from './elevationNoise/elevationNoise';

const createNoisedWorldMapSlice = createEventSlice('createNoisedWorldMap', {
  writeCmpts: [WorldMapCmpt],
})<undefined>(
  ({
    eMgr,
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    const worldMapEntity = eMgr.createEntity('worldMap');
    const worldMapCmpt = new WorldMapCmpt();
    const worldMap = worldMapCmpt.data;
    // worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();
    worldMap.tectonics = generateTectonics(18, 800, 400);
    worldMap.dataLayers[WorldMap.Layer.Elevation] = rasterizeTectonics(worldMap.tectonics);
    lowFreqNoise(worldMap.dataLayers[WorldMap.Layer.Elevation]);
    worldMapMgr.add(worldMapEntity, worldMapCmpt);
  },
);

// TODO: move this off of start into its own event
const start = copyEventSlice(DefaultEvent.Start, createNoisedWorldMapSlice);

export const { createNoisedWorldMap } = createNoisedWorldMapSlice;

export default [start.eventListener, createNoisedWorldMapSlice.eventListener];
