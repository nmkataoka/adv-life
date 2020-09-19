import { NComponent } from '../../../0-engine';

export enum ArmorType {
  Boots,
  Chainmail,
  Helm,
  Greaves,
}

export class ArmorTypeCmpt implements NComponent {
  public armorType: ArmorType = ArmorType.Helm;
}
