import { GetComponent } from '0-engine';
import { ProcRule, ExecutorStatus } from '../ProcRule';
import { StatusEffectsCmpt } from '../../Combat/StatusEffectsCmpt';

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
