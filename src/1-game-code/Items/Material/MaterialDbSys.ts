import { ECSystem } from '0-engine';
import { Material } from './Material';
import { MaterialDbCmpt } from './MaterialDbCmpt';
import materialsData from './MaterialsData.json';

export class MaterialDbSys extends ECSystem {
  public Start = (): void => {
    const e = this.eMgr.createEntity('MaterialDb');
    const materialDbCmpt = this.eMgr.addCmpt(e, MaterialDbCmpt, Material);
    materialDbCmpt.readFromArray(materialsData);
  };

  public OnUpdate = (): void => {};
}
