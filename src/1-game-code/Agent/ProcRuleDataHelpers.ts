import { GetComponent } from '0-engine';
import { StatusEffectsCmpt } from '../Combat/StatusEffectsCmpt';

// eslint-disable-next-line import/prefer-default-export
export const createChannelTime = (duration: number): ((self: number, dt: number) => boolean) => {
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
