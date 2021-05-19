import { createEventSlice, Entity } from '0-engine';
import { createTown as createTownInternal } from './createTown';
import { TownCmpt } from './TownCmpt';

interface CreateTownPayload {
  civilizationId: Entity;
  coords: [number, number];
  name?: string;
}

// Civs with excess population can create new towns.
// Towns can be placed at borders (usually preferred) or internally if
// food production in the area can support the higher population density.
// New towns automatically get a footpath road to them from the nearest town.
// Need to track civ border to prevent overlapping civ territories and to
// choose locations for new towns.
const createTownSlice = createEventSlice('createTown', {
  writeCmpts: [TownCmpt],
})<CreateTownPayload>(({ eMgr, payload: { civilizationId, coords, name } }) => {
  createTownInternal(eMgr, civilizationId, coords, name);
});

export const { createTown } = createTownSlice;

export default [createTownSlice.eventListener];
