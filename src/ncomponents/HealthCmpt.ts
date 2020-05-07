export class HealthCmpt {
  public health = 50;
  public maxHealth = 100;

  public TakeDamage(dmg: number): void {
    this.health -= dmg;
  }
}