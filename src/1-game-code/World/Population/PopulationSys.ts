import { createEventSlice } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createRandomPopulationLayer } from './createRandomPopulationLayer';

export interface PopulationGenParams {
  width: number;
  height: number;
}

const createPopulationSlice = createEventSlice('createPopulation', {
  writeCmpts: [WorldMapCmpt, RngCmpt],
})<PopulationGenParams>(
  ({
    payload: { width, height },
    componentManagers: {
      writeCMgrs: [worldMapMgr, rngMgr],
    },
  }) => {
    const worldMap = worldMapMgr.getUniqueMut().data;
    const rng = rngMgr.getUniqueMut().getRng('WorldGen');
    worldMap.dataLayers.population = createRandomPopulationLayer(width, height, rng);
  },
);

export const { createPopulation } = createPopulationSlice;

export default [createPopulationSlice.eventListener];
