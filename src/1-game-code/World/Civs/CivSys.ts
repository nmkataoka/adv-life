import { createEventSlice } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { WorldMapCmpt } from '../WorldMapCmpt';
import { createCiv } from './createCiv';

export interface CivGenParams {
  civName: string;
}

// Initializes civs and their starting towns
const createCivsSlice = createEventSlice('createCivs', {
  writeCmpts: [RngCmpt, WorldMapCmpt],
})<CivGenParams>(
  ({
    componentManagers: {
      writeCMgrs: [rngMgr, worldMapMgr],
    },
    eMgr,
    payload: { civName },
  }) => {
    const worldMap = worldMapMgr.getUniqueMut().data;
    const elevLayer = worldMap.dataLayers.elevation;
    if (!elevLayer) {
      throw new Error('Elevation layer must be generated before town generation');
    }
    const rng = rngMgr.getUniqueMut().getRng('WorldGen');
    createCiv(eMgr, elevLayer, rng, civName);
  },
);

export const { createCivs } = createCivsSlice;

const updateTowns = createEventSlice('updateTowns', {
  writeCmpts: [WorldMapCmpt],
})<void>(
  ({
    componentManagers: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      writeCMgrs: [worldMapMgr],
    },
  }) => {
    // Allow population to reproduce based on food
    // Civs with excess population can create new towns.
    // Towns can be placed at borders (usually preferred) or internally if
    // food production in the area can support the higher population density.
    // New towns automatically get a footpath road to them from the nearest town.
    // Need to track civ border to prevent overlapping civ territories and to
    // choose locations for new towns.
  },
);

export default [createCivsSlice.eventListener, updateTowns.eventListener];
