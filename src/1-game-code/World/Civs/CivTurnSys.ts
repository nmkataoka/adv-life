import { createEventSlice } from '0-engine';
import { updateTowns } from './CivSys';

/** In the civ game mode, each turn is one year. */
const civTurnSlice = createEventSlice(
  'endTurn',
  {},
)<void>(({ eMgr }) => {
  const { dispatch } = eMgr;
  void dispatch(updateTowns());
});

export const { endTurn } = civTurnSlice;

export default [civTurnSlice.eventListener];
