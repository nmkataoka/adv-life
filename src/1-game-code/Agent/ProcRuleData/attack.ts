import { GetComponent } from '0-engine';
import { DispatchEvent } from '0-engine/ECS/globals/DispatchEvent';
import { ProcRule, ExecutorStatus } from '../ProcRule';
import { HealthCmpt } from '../../ncomponents/HealthCmpt';
import { UNIT_ATTACKED } from './Constants';

export const attack = new ProcRule(
  'attack',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [self, target] = entityBinding;
    const targetHealthCmpt = GetComponent(HealthCmpt, target);

    // If no target, attack is finished
    if (!targetHealthCmpt) return ExecutorStatus.Finished;

    const damage = data;
    targetHealthCmpt.TakeDamage(damage);

    DispatchEvent({ type: UNIT_ATTACKED, payload: { self, target, damage } });

    return ExecutorStatus.Finished;
  },
  { canTargetOthers: true },
);
