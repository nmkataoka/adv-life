import { ECSystem } from '../../../0-engine';
import { ItemClass } from './ItemClass';
import { ItemClassDbCmpt } from './ItemClassDbCmpt';
import itemClassesData from './itemClassesData.json';

export class ItemClassDbSys extends ECSystem {
  public Start = (): void => {
    const itemClassDbCmpt = new ItemClassDbCmpt(ItemClass);
    itemClassDbCmpt.readFromArray(itemClassesData);
    const e = this.eMgr.CreateEntity('ItemClassDb');
    this.eMgr.AddComponent(e, itemClassDbCmpt);
  };

  public OnUpdate = (): void => {};
}
