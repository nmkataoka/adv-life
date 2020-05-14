import { NComponent } from "../0-engine/ECS/NComponent";

export class CombatStatsCmpt implements NComponent {
  public mana = 100;
  public maxMana = 100;
  public manaRegen = 10;
}
