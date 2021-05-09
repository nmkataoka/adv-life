import { createEventSlice } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createRandomPopulationLayer } from './createRandomPopulationLayer';
import { reproduce } from './reproduce';

// eslint-disable-next-line
export interface PopulationGenParams {}

const createPopulationSlice = createEventSlice('createPopulation', {
  writeCmpts: [WorldMapCmpt, RngCmpt],
})<PopulationGenParams>(
  ({
    // payload,
    componentManagers: {
      writeCMgrs: [worldMapMgr, rngMgr],
    },
  }) => {
    const worldMap = worldMapMgr.getUniqueMut().data;
    const elevLayer = worldMap.dataLayers.elevation;
    if (!elevLayer) {
      throw new Error('Elevation layer must be generated before Population layer.');
    }
    const rng = rngMgr.getUniqueMut().getRng('WorldGen');
    worldMap.dataLayers.population = createRandomPopulationLayer(elevLayer, rng);
  },
);

const reproducePopulationSlice = createEventSlice('reproducePopulation', {
  writeCmpts: [WorldMapCmpt],
})<void>(
  ({
    componentManagers: {
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    const worldMap = worldMapMgr.getUniqueMut().data;
    const { elevation: elevLayer, population: popLayer, rain: rainLayer } = worldMap.dataLayers;
    if (!elevLayer || !popLayer || !rainLayer) {
      throw new Error(
        'Population reproduction requires elevation, rain, and population layers to already be created.',
      );
    }
    reproduce({ elevLayer, popLayer, rainLayer });
  },
);

export const { createPopulation } = createPopulationSlice;
export const { reproducePopulation } = reproducePopulationSlice;

export default [createPopulationSlice.eventListener, reproducePopulationSlice.eventListener];
