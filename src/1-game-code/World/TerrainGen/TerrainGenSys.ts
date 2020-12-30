import { createEventSlice } from '0-engine';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { WorldMap } from '../WorldMap';
import { createRandomTerrain } from './elevationNoise/createRandomTerrain';
import { generateTectonics } from './tectonicGeneration';
import { rasterizeTectonics } from './tectonicRasterization';
import { lowFreqNoise } from './elevationNoise/elevationNoise';

/** This is mostly just for debugging now, or if the real world map breaks for an extended period of time. */
const createNoisedWorldMapSlice = createEventSlice('createNoisedWorldMap', {
  writeCmpts: [WorldMapCmpt],
})<undefined>(
  ({
    eMgr,
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    if (eMgr.getUniqueCmpt(WorldMapCmpt)) {
      throw new Error('Attempted to create world map when world map already exists.');
    }
    const worldMapEntity = eMgr.createEntity('worldMap');
    const worldMapCmpt = new WorldMapCmpt();
    worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();

    worldMapMgr.add(worldMapEntity, worldMapCmpt);
  },
);

const createWorldMapSlice = createEventSlice('createWorldMap', {
  writeCmpts: [WorldMapCmpt],
})<void>(
  ({
    eMgr,
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    if (eMgr.getUniqueCmpt(WorldMapCmpt)) {
      throw new Error('Attempted to create world map when world map already exists.');
    }
    const worldMapEntity = eMgr.createEntity('worldMap');
    const worldMapCmpt = new WorldMapCmpt();
    const worldMap = worldMapCmpt.data;
    worldMap.tectonics = generateTectonics(18, 800, 400);
    worldMap.dataLayers[WorldMap.Layer.Elevation] = rasterizeTectonics(worldMap.tectonics);
    lowFreqNoise(worldMap.dataLayers[WorldMap.Layer.Elevation]);
    worldMapMgr.add(worldMapEntity, worldMapCmpt);
  },
);

export const { createNoisedWorldMap } = createNoisedWorldMapSlice;
export const { createWorldMap } = createWorldMapSlice;

export default [createNoisedWorldMapSlice.eventListener, createWorldMapSlice.eventListener];
