import { ECSystem } from '../../../0-engine/ECS/ECSystem';
import { GetComponentManager } from '../../../0-engine/ECS/EntityManager';
import { StatusEffectsCmpt } from '../../ncomponents/StatusEffectsCmpt';

export class StatusEffectsSys extends ECSystem {
  public Start(): void{}

  public OnUpdate(dt: number): void {
    const statusEffectsMgr = GetComponentManager(StatusEffectsCmpt);

    Object.values(statusEffectsMgr.components).forEach((statusEffectCmpt) => {
      statusEffectCmpt.DecreaseRemainingTimeOfStatusEffects(dt);
    });
  }
}
