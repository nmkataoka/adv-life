import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';
import { HealthCmpt } from '../../../1- ncomponents/HealthCmpt';
import { DispatchEvent } from '../../../0-engine/ECS/globals/DispatchEvent';


export const attack = new ProcRule(
  'attack',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [self, target] = entityBinding;
    const targetHealthCmpt = GetComponent(HealthCmpt, target);

    // If no target, attack is finished
    if (!targetHealthCmpt) return ExecutorStatus.Finished;

    const damage = data;
    targetHealthCmpt.TakeDamage(damage);

    DispatchEvent({ type: 'combat/unit-attacked', payload: { self, target, damage } });

    return ExecutorStatus.Finished;
  },
  { canTargetOthers: true },
);
