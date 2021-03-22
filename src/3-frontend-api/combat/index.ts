import { Entity } from '0-engine';
import { CombatPositionCmpt } from '1-game-code/ncomponents';
import { componentNode, ComponentNode, selectorNodeFamily } from '4-react-ecsal';

export { setSkillTarget } from './setSkillTarget';

const getUnitCombatPos = (unitId: Entity): ComponentNode<CombatPositionCmpt> =>
  componentNode(CombatPositionCmpt, unitId);

export const getUnitPosition = selectorNodeFamily({
  get: (unitId: Entity) => ({ get }) => {
    const [combatPos] = get(getUnitCombatPos(unitId));
    if (!combatPos) return undefined;
    return { ...combatPos.pos };
  },
  computeKey: (unitId: Entity) => `${unitId}`,
});
