import { createEventSlice, DefaultEvent } from '0-engine';
import { Material } from './Material';
import { MaterialDbCmpt } from './MaterialDbCmpt';
import materialsData from './MaterialsData.json';

const materialDbSysSlice = createEventSlice(DefaultEvent.Start, {
  writeCmpts: [MaterialDbCmpt],
})<undefined>(
  ({
    componentManagers: {
      writeCMgrs: [materialDbMgr],
    },
    eMgr,
  }) => {
    const e = eMgr.createEntity('MaterialDb');
    const materialDbCmpt = new MaterialDbCmpt(Material);
    materialDbCmpt.readFromArray(materialsData);
    materialDbMgr.add(e, materialDbCmpt);
  },
);

export default [materialDbSysSlice.eventListener];
