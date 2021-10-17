import { Entity } from '0-engine';
import { ComponentManager } from '0-engine/ECS/component-manager/ComponentManager';
import { AgentCmpt } from '1-game-code/ncomponents';
import { Random } from '1-game-code/prng';
import { RngCmpt } from '1-game-code/prng/RngCmpt';
import { TownCmpt } from '1-game-code/Town/TownCmpt';
import { createTown } from '1-game-code/Town/TownSys';
import { CivCmpt } from '1-game-code/World/Civs/CivCmpt';
import { NMath } from '8-helpers/math';
import ConditionSet from '../ConditionSet/ConditionSet';
import EntityTemplate from '../ConditionSet/EntityTemplate';
import { DefaultState, ExecutorStatus, ProcRule, RequiredProps, TickReturn } from '../ProcRule';

interface CreateTownProps extends RequiredProps {
  coords?: [number, number];
}

function chooseTownLocation(
  townMgr: ComponentManager<TownCmpt>,
  civId: Entity,
  rng: Random,
): [number, number] {
  const towns = townMgr.findByProperty('civilizationId', civId);
  if (towns.length === 0) {
    throw new Error(`Could not find any town associated with civilization ${civId}`);
  }
  // TODO: make sure town is above sea level, otherwise try again up to a max
  // choose a random town
  const town = towns[Math.floor(rng.random() * towns.length)];
  const newPoint = randomlyChoosePointXDistanceAway(town.coords, rng, 10, 20);
  return newPoint;
}

export class CreateTown extends ProcRule {
  static conditions = new ConditionSet(2, {
    entityTemplates: [new EntityTemplate(AgentCmpt), new EntityTemplate(CivCmpt)],
    entityRels: [[], [[0, CivCmpt, 'admin']]],
  });

  public tick(props: CreateTownProps, state: DefaultState): TickReturn {
    const { dispatch, entityBinding, eMgr } = props;
    let { coords } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rulerId, civilizationId] = entityBinding;

    if (!coords) {
      const townMgr = eMgr.getMgrMut(TownCmpt);
      const rng = eMgr.getUniqueCmptMut(RngCmpt).getRng('Annual');
      coords = chooseTownLocation(townMgr, civilizationId, rng);
    }

    // In the future, instead of voiding this, we should probably check if the promise is
    // resolved. If no -> Status.Running, if yes -> Success or Failure
    void dispatch(createTown({ civilizationId, coords, name: 'Town' }));
    return { status: ExecutorStatus.Success, state };
  }
}

/** Randomly choose a new point a certain distance away */
function randomlyChoosePointXDistanceAway(
  start: [number, number],
  rng: Random,
  distMin: number,
  distMax?: number,
): [number, number] {
  const [startX, startY] = start;
  const range = distMax ?? distMin - distMin;
  const radius = rng.random() * range + distMin;
  const angle = rng.random() * 2 * NMath.PI;
  // Convert to cartesian
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return [startX + x, startY + y];
}
