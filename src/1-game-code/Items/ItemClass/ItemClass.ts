import { ItemClassTag } from './ItemClassTag';

export class ItemClass {
  constructor(data?: Partial<ItemClass>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public name = '';

  public maxStackSize = 1;

  public value = 1;

  public harvestableResources = [];

  public itemClassTags: ItemClassTag[] = [];
}
