import { NComponent } from '0-engine';

export class HealthCmpt extends NComponent {
  public health = 50;

  public maxHealth = 100;

  public TakeDamage(dmg: number): void {
    this.health -= dmg;
  }
}
