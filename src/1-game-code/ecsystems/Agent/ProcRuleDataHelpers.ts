import { StatusEffectsCmpt } from '../../ncomponents/StatusEffectsCmpt';
import { GetComponent } from '../../../0-engine/ECS/EntityManager';

// eslint-disable-next-line import/prefer-default-export
export const createChannelTime = (duration: number) => {
  let timePassed = 0;

  // Returns true if the channel is finished
  return (self: number, dt: number) => {
    // Update StatusEffectsCmpt
    if (timePassed === 0) {
      const statusEffectsCmpt = GetComponent(StatusEffectsCmpt, self);
      if (statusEffectsCmpt) {
        statusEffectsCmpt.StartEffect('Channel', { severity: 1, duration });
      }
    }

    if (timePassed > duration) return true;
    timePassed += dt;
    return false;
  };
};
