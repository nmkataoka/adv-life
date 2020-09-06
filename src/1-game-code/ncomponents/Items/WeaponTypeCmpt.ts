import { NComponent } from '../../../0-engine/ECS/NComponent';

export enum WeaponType {
  Spear,
  Sword,
  Bow
}

export class WeaponTypeCmpt implements NComponent {
  public weaponType: WeaponType = WeaponType.Sword;
}
