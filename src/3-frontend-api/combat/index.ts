import { Entity } from '0-engine';
import { CombatPositionCmpt } from '1-game-code/ncomponents';
import { componentNode, ComponentNode, SelectorNode, selectorNode } from '4-react-ecsal';
import { Vector2 } from '8-helpers/math';

export { setSkillTarget } from './setSkillTarget';

const getUnitCombatPos = (unitId: Entity): ComponentNode<CombatPositionCmpt> =>
  componentNode(CombatPositionCmpt, unitId);

export const getUnitPosition = (unitId: Entity): SelectorNode<Vector2 | undefined> =>
  selectorNode({
    get: ({ get }) => {
      const [combatPos] = get(getUnitCombatPos(unitId));
      return combatPos?.pos;
    },
  });
