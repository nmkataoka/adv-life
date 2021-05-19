import { createEventSlice } from '0-engine';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { reproduce } from '1-game-code/Town/reproduce';
import { TownCmpt } from '1-game-code/Town/TownCmpt';
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

const updateTownsSlice = createEventSlice('updateTowns', {
  writeCmpts: [WorldMapCmpt, TownCmpt],
})<void>(
  ({
    componentManagers: {
      writeCMgrs: [worldMapMgr, townMgr],
    },
  }) => {
    // Allow population to reproduce based on food
    const townCmpts: TownCmpt[] = [];
    townMgr.forEach((town) => townCmpts.push(town));
    const foodLayer = worldMapMgr.getUniqueMut().data.dataLayers.food;
    if (!foodLayer) {
      throw new Error('Food layer must be created before population sim can begin.');
    }
    reproduce(townCmpts, foodLayer);
  },
);

export const { updateTowns } = updateTownsSlice;

export default [createCivsSlice.eventListener, updateTownsSlice.eventListener];
