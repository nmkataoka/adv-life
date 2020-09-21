import { NComponent } from '0-engine';

export enum ArmorType {
  Boots = 'boots',
  Chainmail = 'chainmail',
  Helm = 'helm',
  Greaves = 'greaves',
}

export class ArmorTypeCmpt implements NComponent {
  public armorType: ArmorType = ArmorType.Helm;
}
