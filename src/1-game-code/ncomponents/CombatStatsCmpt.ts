import { NComponent } from '../../0-engine/ECS/NComponent';

export class CombatStatsCmpt implements NComponent {
  public attackSpeed = 0.2;

  public dexterity = 10;

  // Returns the recovery period after attacks in seconds
  public getAttackCooldown = (): number => 1 / this.attackSpeed;

  public intelligence = 10;

  public magicalAffinity = 10;

  public mana = 100;

  public maxMana = 100;

  public manaRegen = 5;

  public stamina = 10;

  public strength = 10;
}
