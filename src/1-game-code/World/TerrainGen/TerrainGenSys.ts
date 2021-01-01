import { createEventSlice } from '0-engine';
import { NoiseParams } from '1-game-code/Noise';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { WorldMap } from '../WorldMap';
import { createRandomTerrain } from './elevationNoise/createRandomTerrain';
import { generateTectonics } from './tectonicGeneration';
import { rasterizeTectonics } from './tectonicRasterization';
import { lowFreqNoise } from './elevationNoise/elevationNoise';
import { boxBlur } from '../DataLayer/boxBlur';
import { ridgeNoise } from './elevationNoise/ridgeNoise';

/** This is mostly just for debugging now, or if the real world map breaks for an extended period of time. */
const createNoisedWorldMapSlice = createEventSlice('createNoisedWorldMap', {
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
    worldMapCmpt.data.dataLayers[WorldMap.Layer.Elevation] = createRandomTerrain();

    worldMapMgr.add(worldMapEntity, worldMapCmpt);
  },
);

export type TerrainGenParams = {
  width: number;
  height: number;
  numPlates: number;
  oceanFrac: number;
  coastSlope: number;
  ridgeSlope: number;
  riftSlope: number;
  faultPerturbationNoise: NoiseParams;
  lowFreqNoise: NoiseParams;
  ridgeNoise: NoiseParams;
};

const createWorldMapSlice = createEventSlice('createWorldMap', {
  writeCmpts: [WorldMapCmpt],
})<TerrainGenParams>(
  ({
    eMgr,
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
    payload: {
      width,
      height,
      numPlates,
      oceanFrac,
      coastSlope,
      ridgeSlope,
      riftSlope,
      faultPerturbationNoise,
      lowFreqNoise: lowFreqNoiseParams,
      ridgeNoise: ridgeNoiseParams,
    },
  }) => {
    if (eMgr.getUniqueCmpt(WorldMapCmpt)) {
      throw new Error('Attempted to create world map when world map already exists.');
    }
    const worldMapEntity = eMgr.createEntity('worldMap');
    const worldMapCmpt = new WorldMapCmpt();
    const worldMap = worldMapCmpt.data;
    worldMap.tectonics = generateTectonics(
      numPlates,
      width,
      height,
      oceanFrac,
      faultPerturbationNoise,
    );
    const { elevLayer, hillinessLayer } = rasterizeTectonics(
      worldMap.tectonics,
      {
        coastSlope,
        ridgeSlope,
        riftSlope,
      },
      ridgeNoiseParams.scale,
    );
    worldMap.dataLayers[WorldMap.Layer.Elevation] = elevLayer;
    worldMap.dataLayers[WorldMap.Layer.Hilliness] = hillinessLayer;
    boxBlur(elevLayer, 2);
    lowFreqNoise(elevLayer, lowFreqNoiseParams);
    for (let i = 0; i < 3; ++i) {
      boxBlur(hillinessLayer, 10);
    }
    ridgeNoise(elevLayer, hillinessLayer, ridgeNoiseParams);

    worldMapMgr.add(worldMapEntity, worldMapCmpt);
  },
);

export const { createNoisedWorldMap } = createNoisedWorldMapSlice;
export const { createWorldMap } = createWorldMapSlice;

export default [createNoisedWorldMapSlice.eventListener, createWorldMapSlice.eventListener];
