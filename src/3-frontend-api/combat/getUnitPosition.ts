import { CombatPositionCmpt } from '1-game-code/ncomponents';
import { Selector } from '4-react-ecsal';
import { Vector2 } from '8-helpers/math';

export const getUnitPosition = (unitId: number): Selector<Vector2> => (eMgr) => {
  if (unitId < 0) return [0, 0];
  const combatPos = eMgr.getCmpt(CombatPositionCmpt, unitId);
  return combatPos.pos;
};
