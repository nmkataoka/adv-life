import { createEventSliceWithView } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createRandomPopulationLayer } from './createRandomPopulationLayer';

export interface PopulationGenParams {
  width: number;
  height: number;
}

const createPopulationSlice = createEventSliceWithView('createPopulation', {
  writeCmpts: [WorldMapCmpt, RngCmpt],
})<PopulationGenParams>(({ payload: { width, height }, view }) => {
  view.forEach((e, { writeCmpts: [worldMapCmpt, rngCmpt] }) => {
    const worldMap = worldMapCmpt.data;
    const rng = rngCmpt.getRng('WorldGen');
    worldMap.dataLayers.population = createRandomPopulationLayer(width, height, rng);
  });
});

export const { createPopulation } = createPopulationSlice;

export default [createPopulationSlice.eventListener];
