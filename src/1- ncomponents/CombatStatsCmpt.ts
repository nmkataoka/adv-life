import { NComponent } from '../0-engine/ECS/NComponent';

export class CombatStatsCmpt implements NComponent {
  public attackSpeed = 0.6;

  // Returns the recovery period after attacks in seconds
  public getAttackCooldown = () => 1 / this.attackSpeed;

  public mana = 100;

  public maxMana = 100;

  public manaRegen = 10;
}
