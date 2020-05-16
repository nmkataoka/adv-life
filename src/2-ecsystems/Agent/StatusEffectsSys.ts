import { ECSystem } from "../../0-engine/ECS/ECSystem";
import { GetComponentManager } from "../../0-engine/GlobalFunctions";
import { StatusEffectsCmpt } from "../../1- ncomponents/StatusEffectsCmpt";

export class StatusEffectsSys extends ECSystem {
  public Start(): void{}
  
  public OnUpdate(dt: number): void {
    const statusEffectsMgr = GetComponentManager(StatusEffectsCmpt);

    Object.values(statusEffectsMgr.components).forEach(statusEffectCmpt => {
      if(statusEffectCmpt.isChanneling()) {
        statusEffectCmpt.channelRemaining -= dt;
      }
    })
  }
}