import { combatLog } from '1-game-code/Combat/CombatLogSys';
import { Selector } from '4-react-ecsal';

export const getCombatLog: Selector<string[]> = () => {
  return combatLog;
};
