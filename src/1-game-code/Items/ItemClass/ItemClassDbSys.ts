import { createEventSlice, DefaultEvent } from '0-engine';
import { ItemClass } from './ItemClass';
import { ItemClassDbCmpt } from './ItemClassDbCmpt';
import itemClassesData from './itemClassesData.json';

const itemClassDbSysSlice = createEventSlice(DefaultEvent.Start, {
  writeCmpts: [ItemClassDbCmpt],
})<undefined>(
  ({
    componentManagers: {
      writeCMgrs: [itemClassDbMgr],
    },
    eMgr,
  }) => {
    const e = eMgr.createEntity('ItemClassDb');
    const itemClassDbCmpt = new ItemClassDbCmpt(ItemClass);
    itemClassDbCmpt.readFromArray(itemClassesData);
    itemClassDbMgr.add(e, itemClassDbCmpt);
  },
);

export default [itemClassDbSysSlice.eventListener];
