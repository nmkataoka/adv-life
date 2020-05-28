import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';
import { HealthCmpt } from '../../../1- ncomponents/HealthCmpt';

export const heal = new ProcRule(
  'heal',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [, target] = entityBinding;
    const healAmt = data;
    const healthCmpt = GetComponent(HealthCmpt, target);
    if (!healthCmpt) return ExecutorStatus.Error;

    healthCmpt.TakeDamage(-healAmt);
    return ExecutorStatus.Finished;
  },
  { canTargetOthers: true },
);
