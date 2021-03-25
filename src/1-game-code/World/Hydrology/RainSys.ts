import { createEventSlice } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { Vector2 } from '8-helpers/math';
import { DataLayer } from '../DataLayer/DataLayer';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createDrop, descend, Drop } from './Drop';
import { createConstantRainLayer, createRandomRainLayer } from './rainLayer';

const startHydrologySlice = createEventSlice('startHydrology', {
  writeCmpts: [WorldMapCmpt],
})<{ mode?: 'constant' | 'random' | 'real'; size: { x: number; y: number } }>(
  ({
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
    payload: {
      size: { x, y },
      mode = 'random',
    },
  }) => {
    const worldMapCmpt = worldMapMgr.getUniqueMut();
    if (!worldMapCmpt) {
      throw new Error('Need a world map to create hydrology layer.');
    }
    if (worldMapCmpt.data.dataLayers.rain) {
      throw new Error('Tried to create a hydrology layer when it already exists');
    }

    let rainLayer: DataLayer;
    if (mode === 'constant') {
      rainLayer = createConstantRainLayer(x, y);
    } else if (mode === 'random') {
      rainLayer = createRandomRainLayer(x, y);
    } else {
      throw new Error('Not implemented');
    }
    worldMapCmpt.data.dataLayers.rain = rainLayer;
  },
);

export type WaterParams = {
  dropParams: Omit<Partial<Drop>, 'pos'>;
  dt: number;
  numDrops: number;
};

const rainSlice = createEventSlice('rain', {
  writeCmpts: [RngCmpt, WorldMapCmpt],
})<WaterParams>(
  ({
    componentManagers: {
      writeCMgrs: [rngMgr, worldMapMgr],
    },
    payload: { dropParams, dt, numDrops },
  }) => {
    const worldMapCmpt = worldMapMgr.tryGetUniqueMut();

    if (!worldMapCmpt) throw new Error("Tried to rain but world map doesn't exist yet.");

    // Future work, we could link in a true rain map/water cycle here
    // const rainLayer = worldMapCmpt.data.dataLayers.rain;

    // Randomly "rain" a droplet of water on the map
    const elevLayer = worldMapCmpt.data.dataLayers.elevation;
    if (!elevLayer) throw new Error('Missing elevation layer.');
    const { height, width } = elevLayer;
    const rngCmpt = rngMgr.getUniqueMut();
    const rng = rngCmpt.getRng('WorldGen');

    for (let i = 0; i < numDrops; ++i) {
      // console.log(`dropping number ${i}/${numDrops}`);
      const x = Math.floor(width * rng.random());
      const y = Math.floor(height * rng.random());
      const drop = createDrop({ ...dropParams, pos: new Vector2(x, y) });
      descend(drop, elevLayer, dt);
    }
  },
);

export const { startHydrology } = startHydrologySlice;
export const { rain } = rainSlice;

export default [startHydrologySlice.eventListener, rainSlice.eventListener];
