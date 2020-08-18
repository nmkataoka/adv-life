import { NComponent } from '../../0-engine/ECS/NComponent';

export enum ArmorType {
  Boots,
  Chainmail,
  Helm,
  Greaves,
}

export class ArmorTypeCmpt implements NComponent {
  public armorType: ArmorType = ArmorType.Helm;
}
