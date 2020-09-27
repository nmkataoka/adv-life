import { EntityManager } from '0-engine';
import { CombatLogSys } from '1-game-code/Combat/CombatLogSys';
import { Selector } from '4-react-ecsal';

export const getCombatLog: Selector<string[]> = (eMgr: EntityManager) => {
  const combatLogSys = eMgr.getSys(CombatLogSys);
  const { entries } = combatLogSys;
  return entries;
};
