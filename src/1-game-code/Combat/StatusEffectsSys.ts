import { ECSystem, GetComponentManager } from '0-engine';
import { StatusEffectsCmpt } from './StatusEffectsCmpt';

export class StatusEffectsSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(dt: number): void {
    const statusEffectsMgr = GetComponentManager(StatusEffectsCmpt);

    Object.values(statusEffectsMgr.components).forEach((statusEffectCmpt) => {
      statusEffectCmpt.DecreaseRemainingTimeOfStatusEffects(dt);
    });
  }
}
