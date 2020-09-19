import { NComponent } from '../../0-engine';
import { ItemClass } from './ItemClass';

export class ItemClassDbCmpt implements NComponent {
  private itemClasses: ItemClass[] = [];

  private itemClassIdStringFromInt: string[] = [];

  private itemClassIdIntFromString: { [key: string]: number } = {};

  public addItemClass = (itemClassIdStr: string, itemClass: ItemClass): number => {
    if (this.itemClassIdIntFromString[itemClassIdStr] != null) {
      throw new Error(`ItemClass ${itemClassIdStr} already exists`);
    }

    const newId = this.itemClassIdStringFromInt.length;
    this.itemClassIdStringFromInt.push(itemClassIdStr);
    this.itemClasses.push(itemClass);
    this.itemClassIdIntFromString[itemClassIdStr] = newId;
    return newId;
  };

  public getItemClass = (itemClassId: number): ItemClass => {
    return this.itemClasses[itemClassId];
  };

  public getItemClassByString = (itemClassIdStr: string): ItemClass => {
    const itemClassId = this.getItemClassId(itemClassIdStr);
    return this.getItemClass(itemClassId);
  };

  public getItemClassId = (itemClassIdStr: string): number => {
    return this.itemClassIdIntFromString[itemClassIdStr];
  };

  public getItemClassIdString = (itemClassId: number): string => {
    return this.itemClassIdStringFromInt[itemClassId];
  };
}
