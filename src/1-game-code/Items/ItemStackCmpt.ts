import { NComponent } from '../../0-engine';

export class ItemStackCmpt implements NComponent {
  public health = 1;

  /** Indexes into the ItemClassDbCmpt */
  public itemClassId = -1;

  /** Indexes into the MaterialDbCmpt */
  public materialId = -1;

  public publicSalePrice = -1;

  public stackCount = 1;
}
