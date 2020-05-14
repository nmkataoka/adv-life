import { ECSystem } from "../0-engine/ECS/ECSystem";
import { CombatStatsCmpt } from "../1- ncomponents/CombatStatsCmpt";

export class ManaRegenSys extends ECSystem {
  public Start(): void {}

  public OnUpdate(dt: number): void {
    this.regenMana(dt);
  }

  private regenMana(dt: number) {
    const { eMgr } = this;
    const combatStatsMgr = eMgr.GetComponentManager<CombatStatsCmpt, typeof CombatStatsCmpt>(
      CombatStatsCmpt
    );

    Object.values(combatStatsMgr.components).forEach((combatStatsCmpt) => {
      const { maxMana, mana, manaRegen } = combatStatsCmpt;
      combatStatsCmpt.mana = Math.min(maxMana, mana + manaRegen * dt);
    });
  }
}
