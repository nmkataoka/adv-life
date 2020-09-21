import { ECSystem } from '0-engine';
import { Material } from './Material';
import { MaterialDbCmpt } from './MaterialDbCmpt';
import materialsData from './MaterialsData.json';

export class MaterialDbSys extends ECSystem {
  public Start = (): void => {
    const materialDbCmpt = new MaterialDbCmpt(Material);
    materialDbCmpt.readFromArray(materialsData);
    const e = this.eMgr.CreateEntity('MaterialDb');
    this.eMgr.AddComponent(e, materialDbCmpt);
  };

  public OnUpdate = (): void => {};
}
