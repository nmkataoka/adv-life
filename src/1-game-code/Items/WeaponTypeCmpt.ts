import { NComponent } from '0-engine';

export enum WeaponType {
  Spear = 'spear',
  Sword = 'sword',
  Bow = 'bow',
}

export class WeaponTypeCmpt implements NComponent {
  public weaponType: WeaponType = WeaponType.Sword;
}
