export class HealthCmpt {
  public health = 100;

  public TakeDamage(dmg: number): void {
    this.health -= dmg;
  }
}