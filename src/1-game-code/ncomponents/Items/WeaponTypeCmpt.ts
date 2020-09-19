import { NComponent } from '../../../0-engine';

export enum WeaponType {
  Spear,
  Sword,
  Bow,
}

export class WeaponTypeCmpt implements NComponent {
  public weaponType: WeaponType = WeaponType.Sword;
}
