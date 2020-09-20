import { Datum, PartialDataType } from '../../Data/Datum';
import { ItemClassTag } from './ItemClassTag';

export class ItemClass extends Datum {
  public name = '';

  public maxStackSize = 1;

  public value = 1;

  public harvestableResources = [];

  public itemClassTags: ItemClassTag[] = [];

  constructor(data: PartialDataType<ItemClass>) {
    super();
    Object.assign(this, data);
    this.init(data);
  }
}
