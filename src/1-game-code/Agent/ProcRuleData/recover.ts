import { ProcRule, ExecutorStatus } from '../ProcRule';
import { GetComponent } from '../../../0-engine';
import { StatusEffectsCmpt } from '../../Combat/StatusEffectsCmpt';

export const recover = new ProcRule('recover', () => {
  let timePassed = 0;

  return (entityBinding: number[], dt: number, data: number) => {
    const recoveryDuration = data;

    // Update StatusEffectsCmpt at beginning
    if (timePassed === 0) {
      const [self] = entityBinding;
      const statusEffectsCmpt = GetComponent(StatusEffectsCmpt, self);
      if (statusEffectsCmpt) {
        statusEffectsCmpt.StartEffect('Recover', { severity: 1, duration: recoveryDuration });
      }
    }

    timePassed += dt;
    if (timePassed >= recoveryDuration) {
      return ExecutorStatus.Finished;
    }
    return ExecutorStatus.Running;
  };
});
