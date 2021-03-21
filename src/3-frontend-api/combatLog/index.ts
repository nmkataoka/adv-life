import { combatLog } from '1-game-code/Combat/CombatLogSys';
import { selectorNode } from '4-react-ecsal';

export const getCombatLog = selectorNode({
  get: () => {
    return combatLog;
  },
});
