import { ECSystem } from '../../0-engine';
import { ItemClass } from './ItemClass';
import { ItemClassDbCmpt } from './ItemClassDbCmpt';
import itemClassesData from './itemClassesData.json';

export class ItemClassDbSys extends ECSystem {
  public Start = (): void => {
    const itemClassDbCmpt = new ItemClassDbCmpt();
    for (let i = 0; i < itemClassesData.length; ++i) {
      const itemClassData = itemClassesData[i];
      const newItemClass = new ItemClass(itemClassData);
      itemClassDbCmpt.itemClasses.push(newItemClass);
    }
  };

  public OnUpdate = (): void => {};
}
