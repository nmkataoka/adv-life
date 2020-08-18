import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';
import { StatusEffectsCmpt } from '../../../1-ncomponents/StatusEffectsCmpt';

export const stealth = new ProcRule(
  'stealth',
  () => (entityBinding: number[], dt: number, data: number) => {
    const [self] = entityBinding;
    const statusEffectsCmpt = GetComponent(StatusEffectsCmpt, self);
    if (!statusEffectsCmpt) return ExecutorStatus.Error;

    statusEffectsCmpt.StartEffect('Stealth', { severity: 1, duration: data });
    return ExecutorStatus.Finished;
  },
);
