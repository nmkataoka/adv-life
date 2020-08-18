import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';
import { HealthCmpt } from '../../../1-ncomponents/HealthCmpt';
import { DispatchEvent } from '../../../0-engine/ECS/globals/DispatchEvent';
import { UNIT_CAST_HEAL } from './Constants';

export const heal = new ProcRule(
  'heal',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [self, target] = entityBinding;
    const healAmt = data;
    const healthCmpt = GetComponent(HealthCmpt, target);
    if (!healthCmpt) return ExecutorStatus.Error;

    healthCmpt.TakeDamage(-healAmt);
    DispatchEvent({
      type: UNIT_CAST_HEAL,
      payload: {
        self, targets: [target], amount: healAmt, name: 'Heal',
      },
    });
    return ExecutorStatus.Finished;
  },
  { canTargetOthers: true },
);
