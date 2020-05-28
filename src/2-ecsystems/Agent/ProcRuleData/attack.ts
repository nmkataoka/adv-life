import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';
import { HealthCmpt } from '../../../1- ncomponents/HealthCmpt';


export const attack = new ProcRule(
  'attack',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [, target] = entityBinding;
    const targetHealthCmpt = GetComponent(HealthCmpt, target);

    // If no target, attack is finished
    if (!targetHealthCmpt) return ExecutorStatus.Finished;

    const damage = data;
    targetHealthCmpt.TakeDamage(damage);
    return ExecutorStatus.Finished;
  },
  { canTargetOthers: true },
);
